package com.sos.smartopenspace.dto.request.auth

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class LoginRequestDTOTest {

    @Test
    fun `toString should return a string without sensitive data`() {
        val email = "test@example.com"
        val loginRequestDTO = LoginRequestDTO(
            email = email,
            password = "secret",
        )

        val expectedString = "LoginRequestDTO(email=$email, password=***)"
        assertEquals(expectedString, loginRequestDTO.toString())
    }
}