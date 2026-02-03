package com.sos.smartopenspace.services.impl

import com.sos.smartopenspace.domain.InvalidTokenException
import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.services.BaseServiceTest
import com.sos.smartopenspace.services.impl.JwtService.Companion.ALGORITHM

import com.sos.smartopenspace.services.impl.JwtService.Companion.ERROR_INVALID_DATES
import com.sos.smartopenspace.services.impl.JwtService.Companion.ERROR_INVALID_USER_ID
import com.sos.smartopenspace.services.impl.JwtService.Companion.EXPIRATION_AT_FIELD
import com.sos.smartopenspace.services.impl.JwtService.Companion.ISSUED_AT_FIELD
import com.sos.smartopenspace.services.impl.JwtService.Companion.SUBJECT_FIELD
import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import com.sos.smartopenspace.services.impl.JwtService.Companion.USER_EMAIL_FIELD
import com.sos.smartopenspace.services.impl.JwtService.Companion.USER_ID_FIELD
import com.sos.smartopenspace.services.impl.JwtService.Companion.USER_NAME_FIELD
import com.sos.smartopenspace.testUtil.ReadMocksHelper
import com.sos.smartopenspace.util.getNowUTC
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date

class JwtServiceTest(
  @Value("\${jwt.secret}")
  private val secretKey: String
) : BaseServiceTest() {

  @Autowired
  private lateinit var jwtService: JwtService

  @ParameterizedTest
  @CsvSource(
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTIzNDU2IiwidXNlcl9lbWFpbCI6InBlcGVAZW1haWwuY29tIiwidXNlcl9uYW1lIjoiUGVwZSBHcmlsbG8iLCJzdWIiOiJwZXBlQGVtYWlsLmNvbSIsImlhdCI6MTczNTE0MTIxMCwiZXhwIjoxNzM2NDM3MjEwfQ.Xl4KCXi6I05eKyEfEkdKBPnS3X5mzjvJkTFt0m1_frg",
    "sarasa"
  )
  fun `test extractToken with Bearer should return trimmed token without Bearer prefix`(
    token: String
  ) {
    val tokenWithHeader =
      jwtService.extractToken("     $TOKEN_PREFIX$token     ")
    assertEquals(token, tokenWithHeader)
  }

  @ParameterizedTest
  @CsvSource(
    "''",
    "' '",
    "'  '",
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTIzNDU2IiwidXNlcl9lbWFpbCI6InBlcGVAZW1haWwuY29tIiwidXNlcl9uYW1lIjoiUGVwZSBHcmlsbG8iLCJzdWIiOiJwZXBlQGVtYWlsLmNvbSIsImlhdCI6MTczNTE0MTIxMCwiZXhwIjoxNzM2NDM3MjEwfQ.Xl4KCXi6I05eKyEfEkdKBPnS3X5mzjvJkTFt0m1_frg",
    "sarasa",
    "BearereyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTIzNDU2IiwidXNlcl9lbWFpbCI6InBlcGVAZW1haWwuY29tIiwidXNlcl9uYW1lIjoiUGVwZSBHcmlsbG8iLCJzdWIiOiJwZXBlQGVtYWlsLmNvbSIsImlhdCI6MTczNTE0MTIxMCwiZXhwIjoxNzM2NDM3MjEwfQ.Xl4KCXi6I05eKyEfEkdKBPnS3X5mzjvJkTFt0m1_frg",
    "Bear eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTIzNDU2IiwidXNlcl9lbWFpbCI6InBlcGVAZW1haWwuY29tIiwidXNlcl9uYW1lIjoiUGVwZSBHcmlsbG8iLCJzdWIiOiJwZXBlQGVtYWlsLmNvbSIsImlhdCI6MTczNTE0MTIxMCwiZXhwIjoxNzM2NDM3MjEwfQ.Xl4KCXi6I05eKyEfEkdKBPnS3X5mzjvJkTFt0m1_frg",
  )
  fun `test extractToken with no expected Bearer with space prefix should throws InvalidTokenException`(
    tokenWithHeader: String
  ) {
    assertThrows(InvalidTokenException::class.java) {
      jwtService.extractToken(tokenWithHeader)
    }
  }


  @Test
  fun `test createToken should return a jwt token and their UUID`() {
    val issuedAt = Instant.now().truncatedTo(ChronoUnit.SECONDS)
    val expirationAt = issuedAt.plus(15, ChronoUnit.DAYS)
    val userId = 123456L
    val userEmail = "pepe_grillo@mail.com"
    val userName = "Pepe Grillo"
    val user = User(
      id = userId,
      email = userEmail,
      name = userName,
    )
    // WHEN
    val (resToken, idToken) = jwtService.createToken(
      issuedAt,
      expirationAt,
      user
    )

    // THEN
    assertNotNull(idToken)
    assertTrue(idToken.isNotBlank())
    assertEquals(36, idToken.length)
    jwtService.getClaimsMap(resToken).let { claims ->
      assertNotNull(claims)
      assertEquals(userEmail, claims[SUBJECT_FIELD])
      assertEquals(issuedAt, getInstantFromLongSeconds(claims[ISSUED_AT_FIELD]))
      assertEquals(
        expirationAt,
        getInstantFromLongSeconds(claims[EXPIRATION_AT_FIELD])
      )
      assertEquals(userEmail, claims[USER_EMAIL_FIELD])
      assertEquals(userName, claims[USER_NAME_FIELD])
      assertEquals(userId, getLongValue(claims[USER_ID_FIELD]))
    }
  }

  @Test
  fun `test createToken should throws IllegalArgumentException user id must be greater than 0`() {
    val issuedAt = Instant.parse("2024-12-25T15:40:10Z")
    val expirationAt = issuedAt.plus(15, ChronoUnit.DAYS)
    val user = User(
      id = 0L,
      email = "pepe_grillo@mail.com",
      name = "Pepe Grillo",
    )
    val ex = assertThrows(IllegalArgumentException::class.java) {
      jwtService.createToken(issuedAt, expirationAt, user)
    }
    assertEquals(ERROR_INVALID_USER_ID, ex.message)
  }

  @Test
  fun `test createToken should throws IllegalArgumentException issuedAt must be before expirationAt date`() {
    val issuedAt = Instant.parse("2024-12-25T15:40:10Z")
    val expirationAt = issuedAt.plus(-1, ChronoUnit.SECONDS)
    val user = User(
      id = 123L,
      email = "pepe_grillo@mail.com",
      name = "Pepe Grillo",
    )
    val ex = assertThrows(IllegalArgumentException::class.java) {
      jwtService.createToken(issuedAt, expirationAt, user)
    }
    assertEquals(ERROR_INVALID_DATES, ex.message)
  }


  @Test
  fun `test isValidToken should return truthy`() {
    val issuedAt = getNowUTC()
    val expirationAt = issuedAt.plus(5, ChronoUnit.MINUTES)
    val user = User(
      id = 123456L,
      email = "pepe@email.com",
      name = "Pepe Grillo",
    )
    val (validToken, tokenId) = jwtService.createToken(
      issuedAt,
      expirationAt,
      user
    )

    // WHEN
    val result = jwtService.isValidToken(validToken)

    // THEN
    assertTrue(result)
    assertNotNull(tokenId)
    assertEquals(36, tokenId.length)
  }

  @Test
  fun `test isValidToken should return falsy with expired token`() {
    val issuedAt = getNowUTC().plus(-1, ChronoUnit.DAYS)
    val expirationAt = issuedAt.plus(5, ChronoUnit.SECONDS)
    val user = User(
      id = 123456L,
      email = "pepe@email.com",
      name = "Pepe Grillo",
    )
    val (validToken, tokenId) = jwtService.createToken(
      issuedAt,
      expirationAt,
      user
    )

    // WHEN
    val result = jwtService.isValidToken(validToken)

    // THEN
    assertFalse(result)
    assertNotNull(tokenId)
    assertEquals(36, tokenId.length)
  }

  @ParameterizedTest(name = "{0}")
  @CsvSource(
    "not valid token,invalid_token.txt",
    "valid jwt token with not match sign key,valid_and_not_match_sign_key.txt",
    "valid jwt token with invalid userID,valid_with_invalid_user_id.txt",
  )
  fun `test isValidToken should return falsy`(
    testName: String,
    tokenFile: String
  ) {
    val token = ReadMocksHelper.readJwtTokenMocksFile(tokenFile)
    val result = jwtService.isValidToken(token)
    assertFalse(result)
  }

  @Test
  fun `test extractUserId should return ok user id long value`() {
    val userId = 123L
    val (token, tokenId) = buildValidJwtTokenWith(userId = userId)
    // WHEN
    val result = jwtService.extractUserId(token)
    // THEN
    assertEquals(userId, result)
    assertNotNull(tokenId)
    assertEquals(36, tokenId.length)
  }

  @ParameterizedTest(name = "{0}")
  @CsvSource(
    "not valid token,invalid_token.txt",
    "valid jwt token with not match sign key,valid_and_not_match_sign_key.txt",
    "valid jwt token with invalid userID,valid_with_invalid_user_id.txt",
  )
  fun `test extractUserId should throws InvalidTokenException`(
    testName: String,
    tokenFile: String
  ) {
    val token = ReadMocksHelper.readJwtTokenMocksFile(tokenFile)
    assertThrows(InvalidTokenException::class.java) {
      jwtService.extractUserId(token)
    }
  }

  @Test
  fun `test getClaimsMap should return ok user id long value`() {
    val issuedAt = Instant.now().truncatedTo(ChronoUnit.SECONDS)
    val expTimeDays = 2L
    val expTimeChronoUnit = ChronoUnit.DAYS
    val expirationAt = issuedAt.plus(expTimeDays, expTimeChronoUnit)
    val userId = 123L
    val userEmail = "pepe_grillo@mail.com"
    val userName = "pepe grillo"
    val (token, tokenId) = buildValidJwtTokenWith(
      userId = userId,
      userEmail = userEmail,
      userName = userName,
      issuedAt = issuedAt,
      expirationPlusTime = expTimeDays,
      expirationChronoUnit = expTimeChronoUnit,
    )
    // WHEN
    jwtService.getClaimsMap(token).let { claimsMapRes ->
      // THEN
      assertNotNull(claimsMapRes)
      assertEquals(userEmail, claimsMapRes[SUBJECT_FIELD])
      assertEquals(
        issuedAt,
        getInstantFromLongSeconds(claimsMapRes[ISSUED_AT_FIELD])
      )
      assertEquals(
        expirationAt,
        getInstantFromLongSeconds(claimsMapRes[EXPIRATION_AT_FIELD])
      )
      assertEquals(userEmail, claimsMapRes[USER_EMAIL_FIELD])
      assertEquals(userName, claimsMapRes[USER_NAME_FIELD])
      assertEquals(userId, getLongValue(claimsMapRes[USER_ID_FIELD]))
    }
    assertNotNull(tokenId)
    assertEquals(36, tokenId.length)
  }

  @ParameterizedTest(name = "{0}")
  @CsvSource(
    "not valid token,invalid_token.txt",
    "valid jwt token with not match sign key,valid_and_not_match_sign_key.txt",
    "valid jwt token with invalid userID,valid_with_invalid_user_id.txt",
  )
  fun `test getClaimsMap should throws InvalidTokenException`(
    testName: String,
    tokenFile: String
  ) {
    val token = ReadMocksHelper.readJwtTokenMocksFile(tokenFile)
    assertThrows(InvalidTokenException::class.java) {
      jwtService.getClaimsMap(token)
    }
  }

  @Test
  fun `test extractId should extract the UUID generated`() {
    val issuedAt = Instant.now().truncatedTo(ChronoUnit.SECONDS)
    val expTimeDays = 2L
    val expTimeChronoUnit = ChronoUnit.DAYS
    val userId = 123L
    val userEmail = "pepe_grillo@mail.com"
    val userName = "pepe grillo"
    val (token, tokenId) = buildValidJwtTokenWith(
      userId = userId,
      userEmail = userEmail,
      userName = userName,
      issuedAt = issuedAt,
      expirationPlusTime = expTimeDays,
      expirationChronoUnit = expTimeChronoUnit,
    )
    // WHEN
    val id = jwtService.extractId(token)

    assertNotNull(id, "the JWT id should not be null")
    assertTrue(id.isNotBlank())
    assertEquals(36, id.length, "the JWT id should be a valid UUID")
    assertEquals(tokenId, id)
  }

  @Test
  fun `test extractId with token without id should throws Exception`() {
    val jwtWithoutId = buildJwtTestWithoutJwtId()
    assertThrows<InvalidTokenException> { jwtService.extractId(jwtWithoutId) }
  }

  private fun getLongValue(any: Any?): Long =
    when (any) {
      is Number -> any.toLong()
      else -> throw IllegalArgumentException("is not a Number type")
    }


  private fun buildJwtTestWithoutJwtId(): String {
    val userPayload = mapOf(
      USER_ID_FIELD to 123L,
      USER_EMAIL_FIELD to "email@gmail.com",
      USER_NAME_FIELD to "Test User",
    )
    return Jwts.builder()
      .claims(userPayload)
      .subject(userPayload[USER_EMAIL_FIELD].toString())
      .issuedAt(Date.from(Instant.now()))
      .expiration(Date.from(Instant.now().plus(15, ChronoUnit.DAYS)))
      .signWith(getSignKey(), ALGORITHM)
      .compact()
  }

  private fun getSignKey() =
    Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey))

  private fun getInstantFromLongSeconds(any: Any?): Instant =
    Instant.ofEpochSecond(getLongValue(any))


  private fun buildValidJwtTokenWith(
    issuedAt: Instant = Instant.now().truncatedTo(ChronoUnit.SECONDS),
    expirationPlusTime: Long = 15,
    expirationChronoUnit: ChronoUnit = ChronoUnit.DAYS,
    userId: Long = 123456,
    userEmail: String = "pepe_grillo@mail.com",
    userName: String = "Pepe Grillo",
  ): Pair<String, String> {
    val expirationAt = issuedAt.plus(expirationPlusTime, expirationChronoUnit)
    val user = User(
      id = userId,
      email = userEmail,
      name = userName,
    )
    return jwtService.createToken(issuedAt, expirationAt, user)
  }
}
