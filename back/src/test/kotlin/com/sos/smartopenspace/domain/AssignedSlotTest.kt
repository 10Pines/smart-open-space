package com.sos.smartopenspace.domain

import com.sos.smartopenspace.sampler.TalkSampler
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.net.URI
import java.time.LocalDate
import java.time.LocalTime

class AssignedSlotTest {

    @Test
    fun `test toString`() {
        val talkSlot = TalkSlot(
            startTime = LocalTime.parse("09:00"),
            endTime = LocalTime.parse("09:30"),
            date = LocalDate.now()
        )
        val room = Room(
            name = "Conference Room",
            description = "A room for meetings",
            link = URI.create("http://example.com").toURL()
        )
        val talk = TalkSampler.getWith(
            id = 1,
            name = "talk-test",
            speakerName = "user-test",
        )
        val assignedSlot = AssignedSlot(
            slot = talkSlot,
            room = room,
            talk = talk
        )

        val expectedRes = "AssignedSlot(id=0, room=Room(description=A room for meetings, id=0, link=http://example.com, " +
                "name=Conference Room), slot=TalkSlot(date=2024-11-05, endTime=09:30, id=0, startTime=09:00), " +
                "talk=Talk(description=, documents=[], id=1, isMarketplaceTalk=false, meetingLink=null, " +
                "name=talk-test, reviews=[], speaker=User(email=test@mail.com, id=1, name=testuser, password=***, " +
                "resetToken=***, resetTokenLifetime=***), speakerName=user-test, track=null, votingUsers=[]))"
        assertEquals(expectedRes, assignedSlot.toString())
    }

}