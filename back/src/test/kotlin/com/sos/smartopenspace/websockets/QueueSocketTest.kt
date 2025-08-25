package com.sos.smartopenspace.websockets

import com.sos.smartopenspace.controllers.BaseIntegrationTest
import com.sos.smartopenspace.domain.OpenSpaceNotFoundException
import com.sos.smartopenspace.domain.Talk
import com.sos.smartopenspace.sampler.OpenSpaceSampler
import com.sos.smartopenspace.sampler.TalkSampler
import com.sos.smartopenspace.sampler.UserSampler
import com.sos.smartopenspace.translators.TalkTranslator
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired

class QueueSocketTest : BaseIntegrationTest() {

  @Autowired
  private lateinit var queueSocket: QueueSocket

  @Test
  fun `test Given QueueSocket and a openSpaceId which not exist WHEN getData THEN throws OpenSpaceNotFoundException`() {
    val openSpaceId = 15L

    assertThrows<OpenSpaceNotFoundException> {
      queueSocket.getData(openSpaceId)
    }
  }

  @Test
  fun `test Given QueueSocket and a openSpaceId which exist with empty queue talks WHEN getData with OpenSpaceId THEN return an empty list`() {
    val queueTalks = mutableListOf<Talk>()
    val persistedUser =
      userRepo.save(UserSampler.getWith(name = "Pepe", email = getAnyUniqueEmail()))
    val openSpace = OpenSpaceSampler.getWith(
      name = "Test Open Space",
      organizer = persistedUser,
      queueTalks = queueTalks
    )
    val openSpacePersisted = openSpaceRepository.save(openSpace)

    // WHEN
    val res = queueSocket.getData(openSpacePersisted.id)

    // THEN
    assertTrue(res.isEmpty())
  }

  @Test
  fun `test Given QueueSocket and a openSpaceId which exist but has queue talks WHEN getData with OpenSpaceId THEN return the expected list`() {

    val persistedUser =
      userRepo.save(UserSampler.getWith(name = "Pepe", email = getAnyUniqueEmail()))

    val talkPersisted1 = talkRepository.save(
      TalkSampler.getWith(
        id = 0L,
        name = "Talk 1",
        description = "Description of talk 1",
        speaker = persistedUser
      )
    )

    val talkPersisted2 = talkRepository.save(
      TalkSampler.getWith(
        id = 0L,
        name = "Talk 2",
        description = "Description of talk 2",
        speaker = persistedUser
      )
    )

    val openSpace = OpenSpaceSampler.getWith(
      name = "Test Open Space",
      organizer = persistedUser,
      talks = mutableSetOf(talkPersisted2, talkPersisted1),
      queueTalks = mutableListOf(talkPersisted1, talkPersisted2)
    )
    val openSpacePersisted = openSpaceRepository.save(openSpace)

    // WHEN
    val res = queueSocket.getData(openSpacePersisted.id)

    // THEN
    assertEquals(openSpacePersisted.queue.size, res.size)
    openSpacePersisted.queue.forEach { queueTalk ->
      assertEquals(TalkTranslator.translateFrom(queueTalk), res.find { it.id == queueTalk.id }!!)
    }
  }

  @Test
  fun `test Given QueueSocket and an openSpace with empty queue talks WHEN getData with openSpace THEN return an empty list`() {
    val queueTalks = mutableListOf<Talk>()
    val persistedUser =
      userRepo.save(UserSampler.getWith(name = "Pepe", email = getAnyUniqueEmail()))
    val openSpace = OpenSpaceSampler.getWith(
      name = "Test Open Space",
      organizer = persistedUser,
      queueTalks = queueTalks
    )
    val openSpacePersisted = openSpaceRepository.save(openSpace)

    // WHEN
    val res = queueSocket.getData(openSpacePersisted)

    // THEN
    assertTrue(res.isEmpty())
  }

  @Test
  fun `test Given QueueSocket and a openSpace with queue talks WHEN getData with OpenSpaceId THEN return the expected list`() {

    val persistedUser =
      userRepo.save(UserSampler.getWith(name = "Pepe", email = getAnyUniqueEmail()))

    val talkPersisted1 = talkRepository.save(
      TalkSampler.getWith(
        id = 0L,
        name = "Talk 1",
        description = "Description of talk 1",
        speaker = persistedUser
      )
    )

    val talkPersisted2 = talkRepository.save(
      TalkSampler.getWith(
        id = 0L,
        name = "Talk 2",
        description = "Description of talk 2",
        speaker = persistedUser
      )
    )

    val openSpace = OpenSpaceSampler.getWith(
      name = "Test Open Space",
      organizer = persistedUser,
      talks = mutableSetOf(talkPersisted2, talkPersisted1),
      queueTalks = mutableListOf(talkPersisted1, talkPersisted2)
    )
    val openSpacePersisted = openSpaceRepository.save(openSpace)

    // WHEN
    val res = queueSocket.getData(openSpacePersisted)

    // THEN
    assertEquals(openSpacePersisted.queue.size, res.size)
    openSpacePersisted.queue.forEach { queueTalk ->
      assertEquals(TalkTranslator.translateFrom(queueTalk), res.find { it.id == queueTalk.id }!!)
    }
  }


}