package com.sos.smartopenspace.dto.response

import com.sos.smartopenspace.util.toStringByReflex
import java.time.LocalDate
import java.time.LocalTime


const val TALK_SLOT_TYPE = "TalkSlot"
const val OTHER_SLOT_TYPE = "OtherSlot"

abstract class SlotResponseDTO(
    val id: Long,
    val startTime: LocalTime,
    val endTime: LocalTime,
    val date: LocalDate,
    val type: String,
    val assignable: Boolean,
) {
    override fun toString(): String =
        toStringByReflex(this)
}

class TalkSlotResponseDTO(
    id: Long,
    startTime: LocalTime,
    endTime: LocalTime,
    date: LocalDate,
) : SlotResponseDTO(id, startTime, endTime, date, TALK_SLOT_TYPE, true)

class OtherSlotResponseDTO(
    id: Long,
    startTime: LocalTime,
    endTime: LocalTime,
    date: LocalDate,
    val description: String,
) : SlotResponseDTO(id, startTime, endTime, date, OTHER_SLOT_TYPE, false)

