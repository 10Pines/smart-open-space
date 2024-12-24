package com.sos.smartopenspace.dto.response.auth

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class AuthResponseDTOTest {

    @Test
    fun `toString should return a string without sensitive data`() {
        val authResponseDTO = AuthResponseDTO(
            token = "asdashjkdsajhk"
        )
        val expectedString = "AuthResponseDTO(token=***)"
        assertEquals(expectedString, authResponseDTO.toString())
    }

}