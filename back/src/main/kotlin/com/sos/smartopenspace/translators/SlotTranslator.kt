package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.OtherSlot
import com.sos.smartopenspace.domain.Slot
import com.sos.smartopenspace.domain.TalkSlot
import com.sos.smartopenspace.dto.response.OtherSlotResponseDTO
import com.sos.smartopenspace.dto.response.SlotResponseDTO
import com.sos.smartopenspace.dto.response.TalkSlotResponseDTO

object SlotTranslator {
  fun translateFrom(domain: Slot): SlotResponseDTO = when (domain) {
    is TalkSlot -> TalkSlotTranslator.translateFrom(domain)
    is OtherSlot -> OtherSlotTranslator.translateFrom(domain)
    else -> throw IllegalArgumentException("unknown slot type")
  }
}

object TalkSlotTranslator {
  fun translateFrom(domain: TalkSlot) = TalkSlotResponseDTO(
    id = domain.id,
    startTime = domain.startTime,
    endTime = domain.endTime,
    date = domain.date,
  )
}

object OtherSlotTranslator {
  fun translateFrom(domain: OtherSlot) = OtherSlotResponseDTO(
    id = domain.id,
    startTime = domain.startTime,
    endTime = domain.endTime,
    date = domain.date,
    description = domain.description,
  )
}
