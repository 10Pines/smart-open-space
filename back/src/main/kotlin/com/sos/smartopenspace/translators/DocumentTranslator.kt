package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.Document
import com.sos.smartopenspace.dto.response.DocumentResponseDTO

object DocumentTranslator {
  fun translateFrom(domain: Document) = DocumentResponseDTO(
    id = domain.id,
    name = domain.name,
    link = domain.link,
  )

}
