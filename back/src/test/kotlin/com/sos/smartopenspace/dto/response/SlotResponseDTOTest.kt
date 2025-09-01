package com.sos.smartopenspace.dto.response

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.time.LocalTime

class SlotResponseDTOTest {

  @Test
  fun `test TalkSlotResponseDTO toString should return a string representation of that class`() {
    val talkSlotResponseDTO = TalkSlotResponseDTO(
      id = 1L,
      startTime = LocalTime.of(10, 0),
      endTime = LocalTime.of(11, 0),
      date = LocalDate.of(2023, 10, 1)
    )

    val expectedString =
      "TalkSlotResponseDTO(assignable=true, date=2023-10-01, endTime=11:00, id=1, startTime=10:00, type=TalkSlot)"
    assertEquals(expectedString, talkSlotResponseDTO.toString())
  }

  @Test
  fun `test OtherSlotResponseDTO toString should return a string representation of that class`() {
    val otherSlotResponseDTO = OtherSlotResponseDTO(
      id = 2L,
      startTime = LocalTime.of(12, 0),
      endTime = LocalTime.of(13, 0),
      date = LocalDate.of(2023, 10, 1),
      description = "Lunch Break"
    )

    val expectedString =
      "OtherSlotResponseDTO(assignable=false, date=2023-10-01, description=Lunch Break, endTime=13:00, id=2, startTime=12:00, type=OtherSlot)"
    assertEquals(expectedString, otherSlotResponseDTO.toString())
  }

  @Test
  fun `test TalkSlotResponseDTO equals and hashcode should return true for equal objects`() {
    val slot1 = TalkSlotResponseDTO(
      id = 1L,
      startTime = LocalTime.of(10, 0),
      endTime = LocalTime.of(11, 0),
      date = LocalDate.of(2023, 10, 1)
    )
    val slot2 = TalkSlotResponseDTO(
      id = 1L,
      startTime = LocalTime.of(10, 0),
      endTime = LocalTime.of(11, 0),
      date = LocalDate.of(2023, 10, 1)
    )

    assertEquals(slot1, slot1)
    assertEquals(slot1, slot2)
    assertEquals(slot2, slot1)
    assertEquals(slot1.hashCode(), slot2.hashCode())
  }

  @Test
  fun `test TalkSlotResponseDTO equals and hashcode should return false for not equal objects`() {
    val slot1 = TalkSlotResponseDTO(
      id = 1L,
      startTime = LocalTime.of(10, 0),
      endTime = LocalTime.of(11, 0),
      date = LocalDate.of(2023, 10, 1)
    )

    val slotsNotEquals: List<SlotResponseDTO?> = listOf(
      null,
      TalkSlotResponseDTO(
        id = 999,
        startTime = slot1.startTime,
        endTime = slot1.endTime,
        date = slot1.date
      ),
      TalkSlotResponseDTO(
        id = slot1.id,
        startTime = slot1.startTime.plusHours(1),
        endTime = slot1.endTime,
        date = slot1.date
      ),
      TalkSlotResponseDTO(
        id = slot1.id,
        startTime = slot1.startTime,
        endTime = slot1.endTime.plusHours(1),
        date = slot1.date
      ),
      TalkSlotResponseDTO(
        id = slot1.id,
        startTime = slot1.startTime,
        endTime = slot1.endTime,
        date = slot1.date.plusDays(1)
      ),
      OtherSlotResponseDTO(
        id = slot1.id,
        startTime = slot1.startTime,
        endTime = slot1.endTime,
        date = slot1.date,
        description = "Different Description"
      )
    )
    slotsNotEquals.forEach { notMatchedSlot ->
      assertNotEquals(slot1, notMatchedSlot)
      assertNotEquals(notMatchedSlot, slot1)
      assertNotEquals(slot1.hashCode(), notMatchedSlot?.hashCode())
    }
  }

  @Test
  fun `test OtherSlotResponseDTO equals and hashcode should return true for equal objects`() {
    val slot1 = OtherSlotResponseDTO(
      id = 1L,
      startTime = LocalTime.of(10, 0),
      endTime = LocalTime.of(11, 0),
      date = LocalDate.of(2023, 10, 1),
      description = "Break Time"
    )
    val slot2 = OtherSlotResponseDTO(
      id = 1L,
      startTime = LocalTime.of(10, 0),
      endTime = LocalTime.of(11, 0),
      date = LocalDate.of(2023, 10, 1),
      description = "Break Time"
    )

    assertEquals(slot1, slot1)
    assertEquals(slot1, slot2)
    assertEquals(slot2, slot1)
    assertEquals(slot1.hashCode(), slot2.hashCode())
  }

  @Test
  fun `test OtherSlotResponseDTO equals and hashcode should return false for not equal objects`() {
    val slot1 = OtherSlotResponseDTO(
      id = 1L,
      startTime = LocalTime.of(10, 0),
      endTime = LocalTime.of(11, 0),
      date = LocalDate.of(2023, 10, 1),
      description = "Break Time"
    )

    val slotsNotEquals: List<SlotResponseDTO?> = listOf(
      null,
      OtherSlotResponseDTO(
        id = 999,
        startTime = slot1.startTime,
        endTime = slot1.endTime,
        date = slot1.date,
        description = slot1.description
      ),
      OtherSlotResponseDTO(
        id = slot1.id,
        startTime = slot1.startTime.plusHours(1),
        endTime = slot1.endTime,
        date = slot1.date,
        description = slot1.description
      ),
      OtherSlotResponseDTO(
        id = slot1.id,
        startTime = slot1.startTime,
        endTime = slot1.endTime.plusHours(1),
        date = slot1.date,
        description = slot1.description
      ),
      OtherSlotResponseDTO(
        id = slot1.id,
        startTime = slot1.startTime,
        endTime = slot1.endTime,
        date = slot1.date.plusDays(1),
        description = slot1.description
      ),
      OtherSlotResponseDTO(
        id = slot1.id,
        startTime = slot1.startTime,
        endTime = slot1.endTime,
        date = slot1.date.plusDays(1),
        description = slot1.description + "x"
      ),
      TalkSlotResponseDTO(
        id = slot1.id,
        startTime = slot1.startTime,
        endTime = slot1.endTime,
        date = slot1.date
      )
    )
    slotsNotEquals.forEach { notMatchedSlot ->
      assertNotEquals(slot1, notMatchedSlot)
      assertNotEquals(notMatchedSlot, slot1)
      assertNotEquals(slot1.hashCode(), notMatchedSlot?.hashCode())
    }
  }
}