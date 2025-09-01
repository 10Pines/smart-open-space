package com.sos.smartopenspace.sampler

import com.sos.smartopenspace.domain.OtherSlot
import com.sos.smartopenspace.domain.TalkSlot
import java.time.LocalDate
import java.time.LocalTime

object SlotSampler {

  fun getTalkSlot(): TalkSlot = getTalkSlotWith()

  fun getTalkSlotWith(
    id: Long = 0L,
    startTime: LocalTime = LocalTime.parse("09:00"),
    endTime: LocalTime = LocalTime.parse("09:30"),
    date: LocalDate = LocalDate.of(2024, 11, 18)
  ): TalkSlot = TalkSlot(
    id = id,
    startTime = startTime,
    endTime = endTime,
    date = date
  )

  fun getOtherSlot(): OtherSlot = getOtherSlotWith()

  fun getOtherSlotWith(
    id: Long = 0L,
    startTime: LocalTime = LocalTime.parse("13:00"),
    endTime: LocalTime = LocalTime.parse("14:00"),
    date: LocalDate = LocalDate.of(2024, 11, 18),
    description: String = "Break"
  ): OtherSlot = OtherSlot(
    id = id,
    startTime = startTime,
    endTime = endTime,
    date = date,
    description = description,
  )

}