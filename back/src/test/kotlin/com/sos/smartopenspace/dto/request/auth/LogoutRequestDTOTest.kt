package com.sos.smartopenspace.dto.request.auth

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class LogoutRequestDTOTest {

    @Test
    fun `toString should return a string without sensitive data`() {
        val logoutRequestDTO = LogoutRequestDTO(
            token = "asdashjkdsajhk"
        )
        val expectedString = "LogoutRequestDTO(token=***)"
        assertEquals(expectedString, logoutRequestDTO.toString())
    }
}