package com.sos.smartopenspace.domain

import com.sos.smartopenspace.sampler.AuthSessionSampler
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.time.Instant

class AuthSessionTest {

  @Test
  fun `test toString method with masking sensitive values`() {
    val createdOn = Instant.parse("2021-08-01T00:00:00Z")
    val expiresOn = Instant.parse("2022-08-01T00:00:00Z")
    val user = User(
      id = 123,
      email = "pepe@mail.com",
      name = "Pepe",
      password = "saarasa",
    )
    val authSession = AuthSession(
      id = "random-id-value-uuid",
      tokenId = "random-token-jwt-value",
      createdOn = createdOn,
      expiresOn = expiresOn,
      revoked = true,
      user = user,
    )
    val expectedRes =
      "AuthSession(createdOn=2021-08-01T00:00:00Z, expiresOn=2022-08-01T00:00:00Z, id=random-id-value-uuid, revoked=true, tokenId=***, user=User(email=pepe@mail.com, id=123, name=Pepe, password=***, resetToken=***, resetTokenLifetime=***))"
    assertEquals(expectedRes, authSession.toString())
  }

  @Test
  fun `test revoked method should set true revoked attribute`() {
    val authSession1 = AuthSessionSampler.getWith(revoked = false)
    val authSession2 = AuthSessionSampler.getWith(revoked = true)
    assertFalse(authSession1.revoked)

    // WHEN
    authSession1.revoke()

    // THEN
    assertTrue(authSession1.revoked)
    assertTrue(authSession2.revoked)
  }

  @Test
  fun `test AuthSession base init`() {
    val createdOn = Instant.parse("2021-08-01T00:00:00Z")
    val expiresOn = Instant.parse("2022-08-01T00:00:00Z")
    val user = User(
      id = 123,
      email = "pepe@mail.com",
      name = "Pepe",
      password = "saarasa",
    )
    val tokenId = "random-token-jwt-id-value"
    val authSession = AuthSession(
      tokenId = tokenId,
      createdOn = createdOn,
      expiresOn = expiresOn,
      user = user,
    )

    assertEquals(createdOn, authSession.createdOn)
    assertEquals(expiresOn, authSession.expiresOn)
    assertEquals(user, authSession.user)
    assertEquals("", authSession.id)
    assertEquals(tokenId, authSession.tokenId)
    assertFalse(
      authSession.revoked,
      "New AuthSession should not be revoked by default"
    )
  }

  @Test
  fun `test AuthSession full init`() {
    val createdOn = Instant.parse("2021-08-01T00:00:00Z")
    val expiresOn = Instant.parse("2022-08-01T00:00:00Z")
    val user = User(
      id = 123,
      email = "pepe@mail.com",
      name = "Pepe",
      password = "saarasa",
    )
    val tokenId = "random-token-jwt-id-value"
    val id = "some_id"
    val revoked = true
    val authSession = AuthSession(
      id = id,
      tokenId = tokenId,
      createdOn = createdOn,
      expiresOn = expiresOn,
      revoked = revoked,
      user = user,
    )

    assertEquals(createdOn, authSession.createdOn)
    assertEquals(expiresOn, authSession.expiresOn)
    assertEquals(user, authSession.user)
    assertEquals(id, authSession.id)
    assertEquals(tokenId, authSession.tokenId)
    assertTrue(authSession.revoked)

  }
}
