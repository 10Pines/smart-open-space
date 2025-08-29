package com.sos.smartopenspace.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty

class RecoveryEmailRequestDTO(
  @field:NotEmpty(message = "Ingrese un email")
  @field:Email(message = "Ingrese un email válido")
  val email: String
)