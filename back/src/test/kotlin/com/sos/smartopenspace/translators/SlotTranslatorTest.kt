package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.OtherSlot
import com.sos.smartopenspace.domain.Slot
import com.sos.smartopenspace.domain.TalkSlot
import com.sos.smartopenspace.dto.response.OtherSlotResponseDTO
import com.sos.smartopenspace.dto.response.TalkSlotResponseDTO
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.LocalDate
import java.time.LocalTime

class SlotTranslatorTest {

    @Test
    fun `test translateFrom with TalkSlot`() {

        val id = 16L
        val startTime = LocalTime.of(10, 0)
        val endTime = LocalTime.of(11, 30)
        val date = LocalDate.of(2025, 12, 15)

        val talkSlot = TalkSlot(
            id = id,
            startTime = startTime,
            endTime = endTime,
            date = date
        )

        // WHEN
        val res = SlotTranslator.translateFrom(talkSlot)

        // THEN
        val expectedDto = TalkSlotResponseDTO(
            id = id,
            startTime = startTime,
            endTime = endTime,
            date = date,
        )
        assertEquals(expectedDto, res)
    }

    @Test
    fun `test translateFrom with OtherSlot`() {

        val id = 16L
        val startTime = LocalTime.of(10, 0)
        val endTime = LocalTime.of(11, 30)
        val description = "Break time!"
        val date = LocalDate.of(2025, 12, 15)

        val otherSlot = OtherSlot(
            id = id,
            startTime = startTime,
            endTime = endTime,
            date = date,
            description = description
        )

        // WHEN
        val res = SlotTranslator.translateFrom(otherSlot)

        // THEN
        val expectedDto = OtherSlotResponseDTO(
            id = id,
            startTime = startTime,
            endTime = endTime,
            date = date,
            description = description
        )
        assertEquals(expectedDto, res)
    }

    @Test
    fun `test translateFrom with not matching case should throws IllegalArgumentException`() {

        val randomSlotClass = RandomSlot()

        // WHEN
        val ex = assertThrows<IllegalArgumentException> {
            SlotTranslator.translateFrom(randomSlotClass)
        }

        // THEN
        val expectedMsg = "unknown slot type"
        assertEquals(expectedMsg, ex.message)
    }


    companion object {
        class RandomSlot :
            Slot(
                id = 1,
                startTime = LocalTime.now(),
                endTime = LocalTime.now(),
                date = LocalDate.now(),
            ) {
            override fun isAssignable(): Boolean = false
            override fun cloneWithDate(date: LocalDate): Slot {
                return this
            }
        }

    }

}