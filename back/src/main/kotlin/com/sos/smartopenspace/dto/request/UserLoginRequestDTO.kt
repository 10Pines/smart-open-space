package com.sos.smartopenspace.dto.request

import com.sos.smartopenspace.util.toStringByReflex
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

data class UserLoginRequestDTO(
  @field:NotEmpty(message = "Ingrese un email")
  @field:Email(message = "Ingrese un email válido")
  val email: String,
  @field:NotEmpty(message = "Ingrese una contraseña")
  @field:NotBlank(message = "Contraseña no puede ser vacía")
  val password: String
) {
  override fun toString(): String =
    toStringByReflex(this, mask = listOf("password"))
}