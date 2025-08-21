package com.sos.smartopenspace.dto.response.purge

import java.time.Instant

data class DeletedSessionsResponseDTO(
  val deletedSessions: Int,
  val creationDateFrom: Instant,
  val creationDateTo: Instant
) {
}
