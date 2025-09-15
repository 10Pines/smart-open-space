package com.sos.smartopenspace.dto.request.auth

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class RegisterRequestDTOTest {

  @Test
  fun `toString should return a string without sensitive data`() {
    val email = "test@example.com"
    val name = "Pepe"
    val registerRequestDTO = RegisterRequestDTO(
      email = email,
      password = "secret",
      name = name,
    )

    val expectedString =
      "RegisterRequestDTO(email=$email, name=$name, password=***)"
    assertEquals(expectedString, registerRequestDTO.toString())
  }
}
