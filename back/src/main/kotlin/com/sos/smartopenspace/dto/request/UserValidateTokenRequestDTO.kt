package com.sos.smartopenspace.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty

class UserValidateTokenRequestDTO(
  @field:NotEmpty(message = "Ingrese un email")
  @field:Email
  val email: String,

  @field:NotEmpty(message = "Ingrese una contraseña")
  val password: String,

  @field:NotEmpty(message = "Ingrese un reset token")
  val resetToken: String
) {
  override fun toString(): String =
    "UserValidateTokenRequestDTO(email='$email', password='***', resetToken='***')"
}