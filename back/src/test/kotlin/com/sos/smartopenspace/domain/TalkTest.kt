package com.sos.smartopenspace.domain

import com.sos.smartopenspace.aUser
import com.sos.smartopenspace.anOpenSpace
import org.junit.jupiter.api.Assertions
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


    assertThrows< NotValidTrackForOpenSpaceException > {
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

    Assertions.assertEquals("Braulio", aMarketplaceTalk.speakerName)
    Assertions.assertNotNull(aMarketplaceTalk.isMarketplaceTalk)
  }
}