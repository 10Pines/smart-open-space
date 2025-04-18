package com.sos.smartopenspace.services

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired


class PasswordEncoderServiceTest: BaseServiceTest() {

    @Autowired
    private lateinit var passwordEncoderService: PasswordEncoderService

    @Test
    fun `encode password`() {
        // Given
        val password = "password123!"

        // When
        val result = passwordEncoderService.encodePassword(password)

        // Then
        assertNotEquals(password, result)
    }

    @Test
    fun `encode and match password`() {
        val password = "password123!"
        val encodedPassword = passwordEncoderService.encodePassword(password)

        assertTrue(passwordEncoderService.matchesPassword(password, encodedPassword))
        assertFalse(passwordEncoderService.matchesPassword("random_value_but_not_password", encodedPassword))
    }
}