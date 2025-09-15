package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.Room
import com.sos.smartopenspace.dto.response.RoomResponseDTO

object RoomTranslator {
  fun translateFrom(domain: Room) = RoomResponseDTO(
    id = domain.id,
    name = domain.name,
    description = domain.description,
    link = domain.link,
  )
}
