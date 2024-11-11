package com.sos.smartopenspace.dto.request

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class UserValidateTokenRequestDTOTest {

    @Test
    fun `toString should return a string without sensitive data`() {
        val userValidateTokenRequestDTO = UserValidateTokenRequestDTO(
            email = "test@example.com",
            password = "secret",
            resetToken = "reset123"
        )

        val expectedString = "UserValidateTokenRequestDTO(email=test@example.com, password=***, resetToken=***)"
        assertEquals(expectedString, userValidateTokenRequestDTO.toString())
    }
}