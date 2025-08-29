package com.sos.smartopenspace.dto.request

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class CreateReviewRequestDTO(
  @field:NotNull(message = "El puntaje debe ser entre 1 a 5")
  @field:Max(value = 5, message = "El puntaje debe ser entre 1 a 5")
  @field:Min(value = 1, message = "El puntaje debe ser entre 1 a 5")
  val grade: Int,

  @field:Size(max = 1000, message = "El comentario admite un máximo de 1000 caracteres")
  val comment: String?
)