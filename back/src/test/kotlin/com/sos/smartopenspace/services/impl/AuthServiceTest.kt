package com.sos.smartopenspace.services.impl

import com.sos.smartopenspace.domain.InvalidTokenException
import com.sos.smartopenspace.domain.UserNotBelongToAuthToken
import com.sos.smartopenspace.persistence.AuthSessionRepository
import com.sos.smartopenspace.services.UserService
import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows

class AuthServiceTest {

  val expirationInMin: Long = 120

  @MockK
  lateinit var authSessionRepository: AuthSessionRepository

  @MockK
  lateinit var userService: UserService

  @MockK
  lateinit var jwtService: JwtService

  lateinit var authService: AuthService

  @BeforeEach
  fun setUp() {
    MockKAnnotations.init(this)
    authService = AuthService(
      expirationInMin = expirationInMin,
      authSessionRepository = authSessionRepository,
      userService = userService,
      jwtService = jwtService
    )
  }

  @Test
  fun `test tokenBelongsToUser should be truthy`() {
    val token = ""
    val tokenHeader = "$TOKEN_PREFIX$token"
    val tokenUserId = 1L
    every { jwtService.extractToken(tokenHeader) } returns token
    every { jwtService.extractUserId(token) } returns tokenUserId

    // WHEN
    val userId = 1L

    // THEN
    val res = authService.tokenBelongsToUser(tokenHeader, userId)
    assertTrue(res)
  }

  @Test
  fun `test GIVEN not match userId WHEN tokenBelongsToUser THEN should be falsy`() {
    val token = ""
    val tokenHeader = "$TOKEN_PREFIX$token"
    val tokenUserId = 2L
    every { jwtService.extractToken(tokenHeader) } returns token
    every { jwtService.extractUserId(token) } returns tokenUserId

    // WHEN
    val userId = 1L

    // THEN
    val res = authService.tokenBelongsToUser(tokenHeader, userId)
    assertFalse(res)
  }

  @Test
  fun `test tokenBelongsToUser with extractUserId error should be falsy`() {
    val token = ""
    val tokenHeader = "$TOKEN_PREFIX$token"
    every { jwtService.extractToken(tokenHeader) } returns token
    every { jwtService.extractUserId(token) } throws IllegalArgumentException("Cannot parse Long")

    // WHEN
    val userId = 1L

    // THEN
    val res = authService.tokenBelongsToUser(tokenHeader, userId)
    assertFalse(res)
  }

  @Test
  fun `test tokenBelongsToUser with extractToken error should be falsy`() {
    val tokenHeader = ""
    every { jwtService.extractToken(tokenHeader) } throws InvalidTokenException()

    // WHEN
    val userId = 1L

    // THEN
    val res = authService.tokenBelongsToUser(tokenHeader, userId)
    assertFalse(res)
  }

  @Test
  fun `test validateTokenBelongsToUserId should do not throw nothing`() {
    val token = ""
    val tokenHeader = "$TOKEN_PREFIX$token"
    val tokenUserId = 1L
    every { jwtService.extractToken(tokenHeader) } returns token
    every { jwtService.extractUserId(token) } returns tokenUserId

    // WHEN
    val userId = 1L

    // THEN
    assertDoesNotThrow {
      authService.validateTokenBelongsToUserId(
        tokenHeader,
        userId
      )
    }
  }

  @Test
  fun `test validateTokenBelongsToUserId should throw UserNotBelongToAuthToken`() {
    val token = ""
    val tokenHeader = "$TOKEN_PREFIX$token"
    val tokenUserId = 2L
    every { jwtService.extractToken(tokenHeader) } returns token
    every { jwtService.extractUserId(token) } returns tokenUserId

    // WHEN
    val userId = 1L

    // THEN
    assertThrows<UserNotBelongToAuthToken> {
      authService.validateTokenBelongsToUserId(
        tokenHeader,
        userId
      )
    }
  }

  @Test
  fun `test validateTokenBelongsToUserId with extractUserId error should throw UserNotBelongToAuthToken`() {
    val token = ""
    val tokenHeader = "$TOKEN_PREFIX$token"
    every { jwtService.extractToken(tokenHeader) } returns token
    every { jwtService.extractUserId(token) } throws IllegalArgumentException("Cannot parse Long")

    // WHEN
    val userId = 1L

    // THEN
    assertThrows<UserNotBelongToAuthToken> {
      authService.validateTokenBelongsToUserId(
        tokenHeader,
        userId
      )
    }
  }

  @Test
  fun `test validateTokenBelongsToUserId with extractToken error should throw UserNotBelongToAuthToken`() {
    val tokenHeader = ""
    every { jwtService.extractToken(tokenHeader) } throws InvalidTokenException()

    // WHEN
    val userId = 1L

    // THEN
    assertThrows<UserNotBelongToAuthToken> {
      authService.validateTokenBelongsToUserId(
        tokenHeader,
        userId
      )
    }
  }

}
