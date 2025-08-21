package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.AssignedSlot
import com.sos.smartopenspace.dto.response.AssignedSlotResponseDTO

object AssignedSlotTranslator {
  fun translateFrom(domain: AssignedSlot) =
    AssignedSlotResponseDTO(
      id = domain.id,
      slot = TalkSlotTranslator.translateFrom(domain.slot),
      room = RoomTranslator.translateFrom(domain.room),
      talk = TalkTranslator.translateFrom(domain.talk),
    )

}
