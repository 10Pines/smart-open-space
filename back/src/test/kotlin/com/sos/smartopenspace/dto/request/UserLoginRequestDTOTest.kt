package com.sos.smartopenspace.dto.request

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class UserLoginRequestDTOTest {

    @Test
    fun `toString should return a string without sensitive data`() {
        val userLoginRequestDTO = UserLoginRequestDTO(
            email = "test@example.com",
            password = "secret"
        )

        val expectedString = "UserLoginRequestDTO(email='test@example.com', password='***')"
        assertEquals(expectedString, userLoginRequestDTO.toString())
    }
}