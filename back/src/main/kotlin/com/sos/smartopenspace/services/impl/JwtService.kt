package com.sos.smartopenspace.services.impl

import com.sos.smartopenspace.domain.InvalidTokenException
import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.util.getNowUTC
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.Date
import java.util.UUID


@Service
class JwtService(
  @Value("\${jwt.secret}")
  private val secretKey: String,
) {

  /**
   * @return the token without the Bearer prefix and trimmed.
   * @throws InvalidTokenException if not contains 'Bearer ' prefix.
   */
  fun extractToken(tokenHeader: String): String {
    val tokenHeaderTrimmed = tokenHeader.trim()
    if (tokenHeaderTrimmed.isBlank() || !tokenHeaderTrimmed.startsWith(
        TOKEN_PREFIX
      )
    ) {
      throw InvalidTokenException()
    }
    return tokenHeaderTrimmed.substring(TOKEN_PREFIX.length)
  }

  /**
   * @return a JWT token with their unique id = (Jwt, JwtId).
   *  JWT contains issuedAt, expirationAt and user email as subject.
   *  Also includes user_id, user_email and user_name payload fields.
   *  @throws IllegalArgumentException if user id is not greater than 0.
   *  @throws IllegalArgumentException if issuedAt is after expirationAt.
   */
  fun createToken(
    issuedAt: Instant,
    expirationAt: Instant,
    user: User
  ): Pair<String, String> {
    if (user.id <= 0) {
      LOGGER.error("$ERROR_INVALID_USER_ID [user_id=${user.id}]")
      throw IllegalArgumentException(ERROR_INVALID_USER_ID)
    }
    if (issuedAt.isAfter(expirationAt)) {
      LOGGER.error("$ERROR_INVALID_DATES [issued_at=${issuedAt}] [expiration_at=${expirationAt}]")
      throw IllegalArgumentException(ERROR_INVALID_DATES)
    }
    val userPayload = mapOf(
      USER_ID_FIELD to user.id,
      USER_EMAIL_FIELD to user.email,
      USER_NAME_FIELD to user.name,
    )
    val jti = UUID.randomUUID().toString()
    val jwt = Jwts.builder()
      .id(jti)
      .claims(userPayload)
      .subject(user.email)
      .issuedAt(Date.from(issuedAt))
      .expiration(Date.from(expirationAt))
      .signWith(getSignKey(), ALGORITHM)
      .compact()
    return jwt to jti
  }

  /**
   * @return TRUE if the token is not expired and contains user_id field with a valid id long value.
   *  Otherwise, returns FALSE.
   */
  fun isValidToken(token: String): Boolean =
    runCatching {
      val claims = getClaims(token)
      extractUserIdFromClaims(claims) > 0
        && claims.expiration.toInstant().isAfter(getNowUTC())
    }.onFailure { ex ->
      LOGGER.error("Error validating token", ex)
    }.getOrDefault(false)


  /**
   * @return user_id field from the token claims.
   * @throws InvalidTokenException if jwt token is not valid.
   * */
  fun extractUserId(token: String): Long =
    runCatching { extractUserIdFromClaims(getClaims(token)) }
      .getOrElse { ex ->
        LOGGER.error("Error extracting user id from token", ex)
        throw InvalidTokenException()
      }

  /**
   * @return jwt id field from the token claims.
   * @throws InvalidTokenException if jwt token is not valid.
   * */
  fun extractId(token: String): String =
    runCatching { getClaims(token).id }
      .getOrElse { ex ->
        LOGGER.error("Error extracting jwt id from token", ex)
        throw InvalidTokenException()
      }

  /**
   * @return a Map<String, Any> with the claims of the token (defaults and payload added in creation).
   * @throws InvalidTokenException if jwt token is not valid.
   * */
  fun getClaimsMap(token: String): Map<String, Any?> =
    runCatching { getClaims(token) }
      .getOrElse { ex ->
        LOGGER.error("Error get claims from token", ex)
        throw InvalidTokenException()
      }

  private fun getClaims(token: String): Claims =
    Jwts.parser()
      .verifyWith(getSignKey())
      .build()
      .parseSignedClaims(token)
      .payload

  private fun extractUserIdFromClaims(claims: Map<String, Any?>): Long =
    when (val userId = claims[USER_ID_FIELD]) {
      is Number -> userId.toLong()
      else -> throw IllegalArgumentException("not Number $USER_ID_FIELD value type")
    }

  private fun getSignKey() =
    Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey))

  companion object {
    const val TOKEN_PREFIX = "Bearer "

    const val ISSUED_AT_FIELD = "iat"
    const val EXPIRATION_AT_FIELD = "exp"
    const val SUBJECT_FIELD = "sub"
    private const val USER_PAYLOAD_PREFIX = "user_"
    const val USER_ID_FIELD = "${USER_PAYLOAD_PREFIX}id"
    const val USER_EMAIL_FIELD = "${USER_PAYLOAD_PREFIX}email"
    const val USER_NAME_FIELD = "${USER_PAYLOAD_PREFIX}name"


    const val ERROR_INVALID_USER_ID = "User id must be greater than 0"
    const val ERROR_INVALID_DATES =
      "IssuedAt date must be before expirationAt date"

    private val ALGORITHM = Jwts.SIG.HS256
    private val LOGGER = LoggerFactory.getLogger(this::class.java)
  }
}
