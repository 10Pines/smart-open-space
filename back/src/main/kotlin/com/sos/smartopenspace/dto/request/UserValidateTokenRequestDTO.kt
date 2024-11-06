package com.sos.smartopenspace.dto.request

import com.sos.smartopenspace.util.toStringByReflex
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty

data class UserValidateTokenRequestDTO(
  @field:NotEmpty(message = "Ingrese un email")
  @field:Email
  val email: String,

  @field:NotEmpty(message = "Ingrese una contraseña")
  val password: String,

  @field:NotEmpty(message = "Ingrese un reset token")
  val resetToken: String
) {
  override fun toString(): String =
    toStringByReflex(this, mask = listOf("password", "resetToken"))
}