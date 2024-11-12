package com.sos.smartopenspace.dto.response

import org.junit.jupiter.api.Assertions.assertEquals
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

        val expectedString = "TalkSlotResponseDTO(assignable=true, date=2023-10-01, endTime=11:00, id=1, startTime=10:00, type=TalkSlot)"
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

        val expectedString = "OtherSlotResponseDTO(assignable=false, date=2023-10-01, description=Lunch Break, endTime=13:00, id=2, startTime=12:00, type=OtherSlot)"
        assertEquals(expectedString, otherSlotResponseDTO.toString())
    }
}