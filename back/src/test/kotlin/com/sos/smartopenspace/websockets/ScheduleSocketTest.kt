package com.sos.smartopenspace.websockets

import com.sos.smartopenspace.controllers.BaseIntegrationTest
import com.sos.smartopenspace.domain.AssignedSlot
import com.sos.smartopenspace.domain.OpenSpaceNotFoundException
import com.sos.smartopenspace.sampler.OpenSpaceSampler
import com.sos.smartopenspace.sampler.RoomSampler
import com.sos.smartopenspace.sampler.SlotSampler
import com.sos.smartopenspace.sampler.TalkSampler
import com.sos.smartopenspace.sampler.UserSampler
import com.sos.smartopenspace.translators.AssignedSlotTranslator
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired

class ScheduleSocketTest : BaseIntegrationTest() {

  @Autowired
  private lateinit var scheduleSocket: ScheduleSocket

  @Test
  fun `test Given ScheduleSocket and an openSpaceId which not exist WHEN getData THEN throws OpenSpaceNotFoundException`() {
    val openSpaceId = 15L

    assertThrows<OpenSpaceNotFoundException> {
      scheduleSocket.getData(openSpaceId)
    }
  }

  @Test
  fun `test Given ScheduleSocket and an openSpaceId which exist with empty assignedSlots WHEN getData with OpenSpaceId THEN return an empty list`() {
    val persistedUser =
      userRepo.save(
        UserSampler.getWith(
          name = "Pepe",
          email = getAnyUniqueEmail()
        )
      )
    val openSpace = OpenSpaceSampler.getWith(
      name = "Test Open Space",
      organizer = persistedUser,
      assignedSlots = mutableSetOf()
    )
    val openSpacePersisted = openSpaceRepository.save(openSpace)

    // WHEN
    val res = scheduleSocket.getData(openSpacePersisted.id)

    // THEN
    assertTrue(res.isEmpty())
  }

  @Test
  fun `test Given ScheduleSocket and an openSpace which exist with empty assignedSlots WHEN getData with OpenSpace THEN return an empty list`() {
    val persistedUser =
      userRepo.save(
        UserSampler.getWith(
          name = "Pepe",
          email = getAnyUniqueEmail()
        )
      )
    val openSpace = OpenSpaceSampler.getWith(
      name = "Test Open Space",
      organizer = persistedUser,
      assignedSlots = mutableSetOf()
    )
    val openSpacePersisted = openSpaceRepository.save(openSpace)

    // WHEN
    val res = scheduleSocket.getData(openSpacePersisted)

    // THEN
    assertTrue(res.isEmpty())
  }

  @Test
  fun `test Given ScheduleSocket and an openSpaceId which exist with assignedSlots WHEN getData with OpenSpaceId THEN return the expected list`() {

    val persistedUser =
      userRepo.save(
        UserSampler.getWith(
          name = "Pepe",
          email = getAnyUniqueEmail()
        )
      )
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
    val talkSlotPersisted1 = slotRepository.save(SlotSampler.getTalkSlotWith())
    val talkSlotPersisted2 = slotRepository.save(SlotSampler.getTalkSlotWith())

    val roomPersisted1 =
      roomRepository.save(RoomSampler.getWith(name = "Room 1"))
    val assignedSlot1 = AssignedSlot(
      talk = talkPersisted1,
      slot = talkSlotPersisted1,
      room = roomPersisted1,
    )
    val assignedSlot2 = AssignedSlot(
      talk = talkPersisted2,
      slot = talkSlotPersisted2,
      room = roomPersisted1,
    )

    val openSpace = OpenSpaceSampler.getWith(
      name = "Test Open Space",
      organizer = persistedUser,
      talks = mutableSetOf(talkPersisted2, talkPersisted1),
      slots = mutableSetOf(),
      assignedSlots = mutableSetOf(assignedSlot2, assignedSlot1)
    )
    val openSpacePersisted = openSpaceRepository.save(openSpace)

    // WHEN
    val res = scheduleSocket.getData(openSpacePersisted.id)

    // THEN
    assertEquals(openSpacePersisted.assignedSlots.size, res.size)
    openSpacePersisted.assignedSlots.forEach { assignedSlot ->
      assertEquals(
        AssignedSlotTranslator.translateFrom(assignedSlot),
        res.find { it.id == assignedSlot.id }!!
      )
    }
  }

  @Test
  fun `test Given ScheduleSocket and an openSpace which exist with assignedSlots WHEN getData with OpenSpace THEN return the expected list`() {

    val persistedUser = userRepo.save(
      UserSampler.getWith(
        name = "Pepe",
        email = getAnyUniqueEmail()
      )
    )
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
    val talkSlotPersisted1 = slotRepository.save(SlotSampler.getTalkSlotWith())
    val talkSlotPersisted2 = slotRepository.save(SlotSampler.getTalkSlotWith())

    val roomPersisted1 =
      roomRepository.save(RoomSampler.getWith(name = "Room 1"))
    val assignedSlot1 = AssignedSlot(
      talk = talkPersisted1,
      slot = talkSlotPersisted1,
      room = roomPersisted1,
    )
    val assignedSlot2 = AssignedSlot(
      talk = talkPersisted2,
      slot = talkSlotPersisted2,
      room = roomPersisted1,
    )

    val openSpace = OpenSpaceSampler.getWith(
      name = "Test Open Space",
      organizer = persistedUser,
      talks = mutableSetOf(talkPersisted2, talkPersisted1),
      slots = mutableSetOf(),
      assignedSlots = mutableSetOf(assignedSlot2, assignedSlot1)
    )
    val openSpacePersisted = openSpaceRepository.save(openSpace)

    // WHEN
    val res = scheduleSocket.getData(openSpacePersisted)

    // THEN
    assertEquals(openSpacePersisted.assignedSlots.size, res.size)
    openSpacePersisted.assignedSlots.forEach { assignedSlot ->
      assertEquals(
        AssignedSlotTranslator.translateFrom(assignedSlot),
        res.find { it.id == assignedSlot.id }!!
      )
    }
  }
}
