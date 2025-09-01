package com.sos.smartopenspace.dto.request

import com.sos.smartopenspace.domain.Document
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import java.net.URL

data class CreateTalkRequestDTO(
  @field:NotEmpty(message = "Ingrese un nombre")
  @field:NotBlank(message = "Nombre no puede ser vacío")
  val name: String,

  val description: String = "",

  val meetingLink: URL? = null,

  val trackId: Long? = null,

  @field:Valid
  val documents: Set<Document> = emptySet(),

  val speakerName: String? = null
)
