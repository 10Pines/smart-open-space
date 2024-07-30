package com.sos.smartopenspace.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

class UserLoginRequestDTO(
  @field:NotEmpty(message = "Ingrese un email")
  @field:Email
  val email: String,
  @field:NotEmpty(message = "Ingrese una contraseña")
  @field:NotBlank(message = "Contraseña no puede ser vacía")
  val password: String
)