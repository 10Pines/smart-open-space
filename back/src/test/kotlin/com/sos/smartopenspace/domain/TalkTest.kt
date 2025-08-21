package com.sos.smartopenspace.domain

import com.sos.smartopenspace.aUser
import com.sos.smartopenspace.anOpenSpace
import com.sos.smartopenspace.sampler.OpenSpaceSampler
import com.sos.smartopenspace.sampler.TalkSampler
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.net.URI

class TalkTest {
  @Test
  fun `a talk cant be modified with a track from another OpenSpace`() {
    val anOpenSpace = anOpenSpace()
    val aUser = aUser()
    aUser.addOpenSpace(anOpenSpace)
    anOpenSpace.toggleCallForPapers(aUser)
    val aTalk = Talk("Una charla", speaker = aUser)
    anOpenSpace.addTalk(aTalk)
    val aTrack = Track("a track name", color = "#FFFFFF")


    assertThrows<NotValidTrackForOpenSpaceException> {
      aTalk.update(
        name = aTalk.name,
        description = aTalk.description,
        track = aTrack,
        openSpace = anOpenSpace
      )
    }
  }


  @Test
  fun `test Talk update without URL and Track`() {

    val talk = TalkSampler.getWith(
      name = "talk-test",
      description = "current description",
      meetingLink = "http://example.com/talk",
      track = Track(name = "Default Track", color = "#FFFFFF")
    )
    val openSpace = OpenSpaceSampler.get()
    val newName = "new name"
    val newDesc = "new description"

    // WHEN
    talk.update(openSpace, newName, newDesc)

    assertEquals(newName, talk.name)
    assertEquals(newDesc, talk.description)
    assertNull(talk.meetingLink)
    assertNull(talk.track)
  }

  @Test
  fun `test Talk update without URL`() {

    val talk = TalkSampler.getWith(
      name = "talk-test",
      description = "current description",
      meetingLink = "http://example.com/talk",
      track = Track(name = "Default Track", color = "#FFFFFF")
    )

    val newTrack = Track(name = "New Track", color = "#123456")
    val openSpace = OpenSpaceSampler.getWith(
      tracks = mutableSetOf(newTrack)
    )
    val newName = "new name"
    val newDesc = "new description"

    // WHEN
    talk.update(openSpace, newName, newDesc, track = newTrack)

    assertEquals(newName, talk.name)
    assertEquals(newDesc, talk.description)
    assertEquals(newTrack, talk.track)
    assertNull(talk.meetingLink)
  }

  @Test
  fun `test Talk update without Track`() {

    val talk = TalkSampler.getWith(
      name = "talk-test",
      description = "current description",
      meetingLink = "http://example.com/talk",
      track = Track(name = "Default Track", color = "#FFFFFF")
    )

    val openSpace = OpenSpaceSampler.get()
    val newName = "new name"
    val newDesc = "new description"

    // WHEN
    val newMeetingLink = URI.create("http://new-meeting-link.com").toURL()
    talk.update(openSpace, newName, newDesc, meetingLink = newMeetingLink)

    assertEquals(newName, talk.name)
    assertEquals(newDesc, talk.description)
    assertEquals(newMeetingLink, talk.meetingLink)
    assertNull(talk.track)
  }

  @Test
  fun `test Talk update without URL But track is not valid THEN should throws NotValidTrackForOpenSpaceException and do not update anything`() {

    val name = "talk-test"
    val description = "current description"
    val track = Track(name = "Default Track", color = "#FFFFFF")
    val meetingLink = "http://example.com/talk"
    val talk = TalkSampler.getWith(
      name = name,
      description = description,
      meetingLink = meetingLink,
      track = track
    )

    val newTrack = Track(name = "New Track", color = "#123456")
    val openSpace = OpenSpaceSampler.getWith(
      tracks = mutableSetOf()
    )
    val newName = "new name"
    val newDesc = "new description"

    // WHEN
    assertThrows<NotValidTrackForOpenSpaceException> {
      talk.update(openSpace, newName, newDesc, track = newTrack)
    }

    assertEquals(name, talk.name)
    assertEquals(description, talk.description)
    assertEquals(track, talk.track)
    assertEquals(URI.create(meetingLink).toURL(), talk.meetingLink)
  }

  @Test
  fun `a marketplace talk has speaker name`() {
    val anOpenSpace = anOpenSpace()
    val aUser = aUser()
    aUser.addOpenSpace(anOpenSpace)
    anOpenSpace.toggleCallForPapers(aUser)
    val aMarketplaceTalk =
      Talk(
        "Una charla",
        speaker = aUser,
        isMarketplaceTalk = true,
        speakerName = "Braulio"
      )

    assertEquals("Braulio", aMarketplaceTalk.speakerName)
    assertNotNull(aMarketplaceTalk.isMarketplaceTalk)
  }

  @Test
  fun `test toString`() {
    val aUser = aUser()
    val aTalk = Talk("Una charla", speaker = aUser)
    val expectedRes =
      "Talk(description=, documents=[], id=0, isMarketplaceTalk=false, meetingLink=null, " +
        "name=Una charla, reviews=[], speaker=User(email=apprentices@sos.sos, id=0, name=apprentices, " +
        "password=***, resetToken=***, resetTokenLifetime=***), speakerName=null, track=null, votingUsers=[])"
    assertEquals(expectedRes, aTalk.toString())
  }
}
