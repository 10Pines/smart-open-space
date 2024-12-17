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
import java.util.*


@Service
class JwtService(
    @Value("\${jwt.secret}")
    private val secretKey: String,
) {

    fun createToken(issuedAt: Instant, expirationAt: Instant, user: User): String {
        val userPayload = listOf(
            USER_ID_FIELD to user.id,
            USER_EMAIL_FIELD to user.email,
            USER_NAME_FIELD to user.name,
        ).associate { (k, v) ->
            buildUserField(k) to "$v"
        }
        return Jwts.builder()
            .claims(userPayload)
            .subject(user.email)
            .issuedAt(Date.from(issuedAt))
            .expiration(Date.from(expirationAt))
            .signWith(getSignKey(), ALGORITHM)
            .compact()
    }

    fun isValidTokenWithUser(token: String, userId: Long): Boolean =
        runCatching {
            val claims = getClaims(token)
            claims[buildUserField(USER_ID_FIELD)] == userId.toString()
                    && claims.expiration.toInstant().isAfter(getNowUTC())
        }.onFailure { ex ->
            LOGGER.error("Error validating userId $userId and token $token", ex)
        }.getOrDefault(false)

    fun isValidToken(token: String): Boolean =
        runCatching {
            val claims = getClaims(token)
            claims[buildUserField(USER_ID_FIELD)].toString().toLong() > 0
                    && claims.expiration.toInstant().isAfter(getNowUTC())
        }.onFailure { ex ->
            LOGGER.error("Error validating token $token", ex)
        }.getOrDefault(false)


    fun extractToken(tokenHeader: String): String {
        if (tokenHeader.isBlank() || !tokenHeader.startsWith(TOKEN_PREFIX)) {
            throw InvalidTokenException()
        }
        return tokenHeader.substring(TOKEN_PREFIX.length)
    }

    fun extractUserField(token: String, field: String): String =
        extractField(token, buildUserField(field))

    fun extractUserId(token: String): Long =
        extractUserField(token, USER_ID_FIELD).toLong()

    fun extractField(token: String, field: String): String {
        return getClaims(token)[field].toString()
    }

    private fun getSignKey() =
        Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey))

    private fun buildUserField(field: String) = "$USER_PAYLOAD_PREFIX$field"

    private fun getClaims(token: String): Claims =
        Jwts.parser()
            .verifyWith(getSignKey())
            .build()
            .parseSignedClaims(token)
            .payload

    companion object {
        const val TOKEN_PREFIX = "Bearer "
        const val USER_ID_FIELD = "id"
        const val USER_EMAIL_FIELD = "email"
        const val USER_NAME_FIELD = "name"

        private const val USER_PAYLOAD_PREFIX = "user_"
        private val ALGORITHM = Jwts.SIG.HS256
        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }
}