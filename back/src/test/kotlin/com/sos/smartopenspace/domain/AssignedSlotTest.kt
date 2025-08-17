package com.sos.smartopenspace.domain

import com.sos.smartopenspace.sampler.RoomSampler
import com.sos.smartopenspace.sampler.SlotSampler
import com.sos.smartopenspace.sampler.TalkSampler
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import java.net.URI
import java.time.LocalDate
import java.time.LocalTime

class AssignedSlotTest {

    @ParameterizedTest
    @CsvSource(
        "09:00, 09:00, true",
        "09:30, 09:30, true",
        "16:59, 16:59, true",
        "16:59, 16:58, false",
        "10:30, 09:30, false",
        "09:30, 10:30, false",
        "09:00, 09:30, false",
        "09:01, 09:00, false",
    )
    fun `test AssignedSlot startAt`(slotStartAt: String, startAtInput: String, expectedRes: Boolean) {

        val talkSlot = SlotSampler.getTalkSlotWith(
            startTime = LocalTime.parse(slotStartAt),
        )
        val room = RoomSampler.get()
        val talk = TalkSampler.get()
        val assignedSlot = AssignedSlot(
            slot = talkSlot,
            room = room,
            talk = talk
        )

        val startAtValue = LocalTime.parse(startAtInput)
        val result = assignedSlot.startAt(startAtValue)

        assertEquals(expectedRes, result)
    }

    @ParameterizedTest
    @CsvSource(
        "2025-12-12, 2025-12-12, true",
        "2025-12-12, 2025-12-13, false",
        "2024-12-12, 2025-12-12, false",
        "2025-12-12, 2024-12-12, false",
        "2024-11-12, 2024-12-12, false",
        "2024-12-11, 2024-12-12, false",
        "2024-12-11, null, false",
    )
    fun `test AssignedSlot hasDate`(slotDate: String, date: String, expectedRes: Boolean) {

        val talkSlot = SlotSampler.getTalkSlotWith(
            date = LocalDate.parse(slotDate),
        )
        val room = RoomSampler.get()
        val talk = TalkSampler.get()
        val assignedSlot = AssignedSlot(
            slot = talkSlot,
            room = room,
            talk = talk
        )

        val date: LocalDate? = if (date == "null") null else LocalDate.parse(date)
        val result = assignedSlot.hasDate(date)

        assertEquals(expectedRes, result)
    }

    @Test
    fun `test AssignedSlot moveTo`() {

        val originalTalkSlot = SlotSampler.getTalkSlotWith(
            date = LocalDate.of(2025, 12, 12),
        )
        val originalRoom = RoomSampler.getWith(
            name = "Original Room",
        )
        val talk = TalkSampler.get()
        val newRoom = RoomSampler.getWith(
            name = "New Room",
        )
        val newSlot = SlotSampler.getTalkSlotWith(
            date = LocalDate.of(2025, 12, 20),
        )

        val id = 1L
        val assignedSlot = AssignedSlot(
            id = id,
            slot = originalTalkSlot,
            room = originalRoom,
            talk = talk
        )

        // WHEN
        assignedSlot.moveTo(newSlot, newRoom)

        // THEN
        assertEquals(newSlot, assignedSlot.slot)
        assertEquals(newRoom, assignedSlot.room)
        assertEquals(id, assignedSlot.id)
        assertEquals(talk, assignedSlot.talk)
    }

    @Test
    fun `test toString`() {
        val talkSlot = TalkSlot(
            startTime = LocalTime.parse("09:00"),
            endTime = LocalTime.parse("09:30"),
            date = LocalDate.of(2024, 11, 18)
        )
        val room = Room(
            name = "Conference Room",
            description = "A room for meetings",
            link = URI.create("http://example.com").toURL()
        )
        val talk = TalkSampler.getWith(
            id = 1,
            name = "talk-test",
            description = "This is a sample talk description.",
            speakerName = "user-test",
        )
        val assignedSlot = AssignedSlot(
            slot = talkSlot,
            room = room,
            talk = talk
        )

        val expectedRes =
            "AssignedSlot(id=0, room=Room(description=A room for meetings, id=0, link=http://example.com, " +
                    "name=Conference Room), slot=TalkSlot(date=2024-11-18, endTime=09:30, id=0, startTime=09:00), " +
                    "talk=Talk(description=This is a sample talk description., documents=[], id=1, " +
                    "isMarketplaceTalk=false, meetingLink=null, name=talk-test, reviews=[], " +
                    "speaker=User(email=test@mail.com, id=1, name=testuser, password=***, resetToken=***, " +
                    "resetTokenLifetime=***), speakerName=user-test, track=null, votingUsers=[]))"
        assertEquals(expectedRes, assignedSlot.toString())
    }

}