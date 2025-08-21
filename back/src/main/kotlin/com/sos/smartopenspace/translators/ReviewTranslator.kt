package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.Review
import com.sos.smartopenspace.dto.response.ReviewResponseDTO

object ReviewTranslator {
  fun translateFrom(domain: Review) = ReviewResponseDTO(
    id = domain.id,
    grade = domain.grade,
    comment = domain.comment,
    reviewer = UserTranslator.translateToUserResponse(domain.reviewer),
  )
}
