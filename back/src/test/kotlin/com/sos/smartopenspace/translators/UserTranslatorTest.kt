package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.dto.request.auth.RegisterRequestDTO
import com.sos.smartopenspace.dto.response.UserResponseDTO
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class UserTranslatorTest {

  @Test
  fun `test translateToUserResponse`() {
    val id = 123L
    val email = "asd@email.com"
    val name = "Pepe Grillo"
    val user = User(
      id = id,
      email = email,
      name = name,
    )

    val result = UserTranslator.translateToUserResponse(user)

    val expectedUserResponseDTO = UserResponseDTO(
      id = id,
      email = email,
      name = name,
    )
    assertEquals(expectedUserResponseDTO, result)
  }

  @Test
  fun `test translateRegisterRequest`() {
    val password = "some_passw0rd!"
    val email = "asd@email.com"
    val name = "Pepe Grillo"
    val registerReq = RegisterRequestDTO(
      email = email,
      name = name,
      password = password,
    )
    val result = UserTranslator.translateRegisterRequest(registerReq)

    assertEquals(email, result.email)
    assertEquals(password, result.password)
    assertEquals(name, result.name)
    assertEquals(0, result.id)
  }

}
