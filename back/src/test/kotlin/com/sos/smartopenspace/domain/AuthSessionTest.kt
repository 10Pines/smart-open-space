package com.sos.smartopenspace.domain

import com.sos.smartopenspace.sampler.AuthSessionSampler
import org.junit.jupiter.api.Assertions.*
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
            token = "random-token-jwt-value",
            createdOn = createdOn,
            expiresOn = expiresOn,
            revoked = true,
            user = user,
        )
        val expectedRes = "AuthSession(createdOn=2021-08-01T00:00:00Z, expiresOn=2022-08-01T00:00:00Z, id=random-id-value-uuid, revoked=true, token=***, user=User(email=pepe@mail.com, id=123, name=Pepe, password=***, resetToken=***, resetTokenLifetime=***))"
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
}