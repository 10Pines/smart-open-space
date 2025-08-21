package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.Track
import com.sos.smartopenspace.dto.response.TrackResponseDTO

object TrackTranslator {
  fun translateFrom(domain: Track) = TrackResponseDTO(
    id = domain.id,
    name = domain.name,
    color = domain.color,
    description = domain.description,
  )
}
