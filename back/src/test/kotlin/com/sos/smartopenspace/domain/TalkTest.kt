package com.sos.smartopenspace.domain

import com.sos.smartopenspace.aUser
import com.sos.smartopenspace.anOpenSpace
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

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
      aTalk.update(name = aTalk.name, description = aTalk.description, track = aTrack, openSpace = anOpenSpace)
    }
  }

  @Test
  fun `a marketplace talk has speaker name`() {
    val anOpenSpace = anOpenSpace()
    val aUser = aUser()
    aUser.addOpenSpace(anOpenSpace)
    anOpenSpace.toggleCallForPapers(aUser)
    val aMarketplaceTalk = Talk("Una charla", speaker = aUser, isMarketplaceTalk=true, speakerName = "Braulio")

    assertEquals("Braulio", aMarketplaceTalk.speakerName)
    assertNotNull(aMarketplaceTalk.isMarketplaceTalk)
  }

  @Test
  fun `test toString`() {
    val aUser = aUser()
    val aTalk = Talk("Una charla", speaker = aUser)
    val expectedRes = "Talk(description=, documents=[], id=0, isMarketplaceTalk=false, meetingLink=null, " +
            "name=Una charla, reviews=[], speaker=User(email=apprentices@sos.sos, id=0, name=apprentices, " +
            "password=***, resetToken=***, resetTokenLifetime=***), speakerName=null, track=null, votingUsers=[])"
    assertEquals(expectedRes, aTalk.toString())
  }
}