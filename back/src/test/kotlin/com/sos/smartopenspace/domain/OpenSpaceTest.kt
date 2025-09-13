package com.sos.smartopenspace.domain

import com.sos.smartopenspace.anOpenSpace
import com.sos.smartopenspace.anOpenSpaceWith
import com.sos.smartopenspace.sampler.OpenSpaceSampler
import com.sos.smartopenspace.sampler.RoomSampler
import com.sos.smartopenspace.sampler.SlotSampler
import com.sos.smartopenspace.sampler.TalkSampler
import com.sos.smartopenspace.sampler.UserSampler
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import java.time.LocalDate
import java.time.LocalTime

class OpenSpaceTest {

  @Test
  fun `an open space is created with necessary fields and contains them`() {
    val nameOpenSpace = "os"
    val openSpace = OpenSpace(
      nameOpenSpace, mutableSetOf(), mutableSetOf()
    )

    assertEquals(openSpace.name, nameOpenSpace)
  }

  @Test
  fun `an open space is created with description and contains it`() {
    val nameOpenSpace = "os"
    val description = "A description"
    val openSpace = OpenSpace(
      nameOpenSpace, mutableSetOf(), mutableSetOf(),
      mutableSetOf(), description
    )

    assertEquals(openSpace.description, description)
  }

  @Test
  fun `an open space starts with inactive call for papers`() {
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    assertFalse(openSpace.isActiveCallForPapers)
  }

  @Test
  fun `an open space starts a call for papers`() {
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    openSpace.toggleCallForPapers(organizer)

    assertTrue(openSpace.isActiveCallForPapers)
  }

  @Test
  fun `a user thats not the organizer cant start call for papers`() {
    val aUser = anyUser()
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    assertThrows<NotTheOrganizerException> {
      openSpace.toggleCallForPapers(aUser)
    }
  }

  @Test
  fun `an open space cannot add a talk when call for papers is closed`() {
    val openSpace = anyOpenSpace()
    val user = anyUser()

    assertThrows(CallForPapersClosedException::class.java) {
      openSpace.addTalk(Talk("Talk", speaker = user))
    }
  }

  @Test
  fun `an open space can add a talk when call for papers is open`() {
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)
    openSpace.toggleCallForPapers(organizer)
    val talk = Talk("Talk", speaker = organizer)

    openSpace.addTalk(talk)

    assertTrue(openSpace.containsTalk(talk))
  }

  @Test
  fun `an open space with no tracks cant add a talk with track`() {
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)
    openSpace.toggleCallForPapers(organizer)
    val aTrack = Track(name = "track", color = "#FFFFFF")
    val aTalk = Talk("Talk", track = aTrack, speaker = organizer)

    assertThrows<NotValidTrackForOpenSpaceException> {
      openSpace.addTalk(aTalk)
    }
  }

  @Test
  fun `an open space with tracks cant add a talk with a different track`() {
    val aTrack = Track(name = "track", color = "#FFFFFF")
    val anotherTrack = Track(name = "another track", color = "#000000")
    val organizer = anyUser()
    val openSpace = anOpenSpace(tracks = setOf(aTrack))
    organizer.addOpenSpace(openSpace)
    openSpace.toggleCallForPapers(organizer)
    val aTalk = Talk("Talk", track = anotherTrack, speaker = organizer)

    assertThrows<NotValidTrackForOpenSpaceException> {
      openSpace.addTalk(aTalk)
    }
  }

  @Test
  fun `an open space with tracks can add a talk without track`() {
    val aTrack = Track(name = "track", color = "#FFFFFF")
    val organizer = anyUser()
    val openSpace = anOpenSpace(tracks = setOf(aTrack))
    organizer.addOpenSpace(openSpace)
    openSpace.toggleCallForPapers(organizer)
    val aTalk = Talk("Talk", speaker = organizer)

    openSpace.addTalk(aTalk)

    assertTrue(openSpace.containsTalk(aTalk))
  }

  @Test
  fun `an open space with tracks can add a talk with track`() {
    val aTrack = Track(name = "track", color = "#FFFFFF")
    val organizer = anyUser()
    val openSpace = anOpenSpace(tracks = setOf(aTrack))
    organizer.addOpenSpace(openSpace)
    openSpace.toggleCallForPapers(organizer)
    val aTalk = Talk("Talk", track = aTrack, speaker = organizer)

    openSpace.addTalk(aTalk)

    assertTrue(openSpace.containsTalk(aTalk))
  }

  @Test
  fun `an open space finishes a call for papers`() {
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    openSpace.toggleCallForPapers(organizer)
    openSpace.toggleCallForPapers(organizer)

    assertFalse(openSpace.isActiveCallForPapers)
  }

  @Test
  fun `an open space is created with a track`() {
    val track = Track(name = "track", color = "#FFFFFF")
    val openSpace = OpenSpace(
      name = "os", rooms = mutableSetOf(), slots = mutableSetOf(),
      talks = mutableSetOf(), tracks = mutableSetOf(track)
    )

    assertEquals(1, openSpace.tracks.size)
    assertEquals(track.color, openSpace.tracks.first().color)
    assertEquals(track.name, openSpace.tracks.first().name)
    assertEquals(track.description, openSpace.tracks.first().description)
  }

  @Test
  fun `an open space updates talk when removing associated track`() {
    val track = Track(name = "track", color = "#FFFFFF")
    val organizer = anyUser()
    val aTalk = Talk("Talk", track = track, speaker = organizer)

    val openSpace = OpenSpace(
      name = "os", rooms = mutableSetOf(), slots = mutableSetOf(),
      talks = mutableSetOf(aTalk), tracks = mutableSetOf(track)
    )
    openSpace.updateTracksAndAssociatedTalks(
      mutableSetOf(),
      mutableSetOf(track),
      mutableListOf(aTalk)
    )

    assertEquals(0, openSpace.tracks.size)
    assertEquals(null, openSpace.talks.first().track)
  }

  @Test
  fun `an openSpace knows when it starts`() {
    val startDate = LocalDate.now()
    val endDate = LocalDate.now().plusDays(1)
    val openSpace = openSpaceWithTwoDates(startDate, endDate)

    assertEquals(startDate, openSpace.startDate())
  }

  @Test
  fun `an openSpace knows when it finishes`() {
    val startDate = LocalDate.now()
    val endDate = LocalDate.now().plusDays(1)
    val openSpace = openSpaceWithTwoDates(startDate, endDate)

    assertEquals(endDate, openSpace.endDate())
  }

  @Test
  fun `an openSpace knows when is hold`() {
    val startDate = LocalDate.now()
    val endDate = LocalDate.now().plusDays(1)
    val openSpace = openSpaceWithTwoDates(startDate, endDate)

    assertEquals(setOf(startDate, endDate), openSpace.dates())
  }

  @Test
  fun `an openSpace removes a talk when scheduled`() {
    val organizer = anyUser()
    val aTalk = Talk("Talk", speaker = organizer)
    val aSlot = TalkSlot(
      LocalTime.parse("09:00"),
      LocalTime.parse("09:30"),
      LocalDate.now()
    )
    val aRoom = Room("Sala")
    val openSpace = anOpenSpaceWith(
      organizer = organizer,
      talk = aTalk,
      slots = setOf(aSlot),
      rooms = setOf(aRoom)
    )
    createAndScheduleTalk(openSpace, organizer, aTalk, aSlot, aRoom)

    openSpace.removeTalk(aTalk)

    assertFalse(openSpace.hasAssignedSlots())
  }

  @Test
  fun `an openSpace removes a talk when queued`() {
    val organizer = anyUser()
    val aTalk = Talk("Talk", speaker = organizer)
    val aSlot = TalkSlot(
      LocalTime.parse("09:00"),
      LocalTime.parse("09:30"),
      LocalDate.now()
    )
    val aRoom = Room("Sala")
    val openSpace = anOpenSpaceWith(
      organizer = organizer,
      talk = aTalk,
      slots = setOf(aSlot),
      rooms = setOf(aRoom)
    )
    createAndEnqueueTalk(openSpace, organizer, aTalk)

    openSpace.removeTalk(aTalk)

    assertFalse(openSpace.hasQueuedTalks())
  }

  @Test
  fun `an openSpace removes a talk that is to be scheduled`() {
    val organizer = anyUser()
    val aTalk = Talk("Talk", speaker = organizer)
    val aSlot = TalkSlot(
      LocalTime.parse("09:00"),
      LocalTime.parse("09:30"),
      LocalDate.now()
    )
    val aRoom = Room("Sala")
    val openSpace = anOpenSpaceWith(
      organizer = organizer,
      talk = aTalk,
      slots = setOf(aSlot),
      rooms = setOf(aRoom)
    )
    createATalkThatIsToBeScheduled(openSpace, organizer, aTalk)

    openSpace.removeTalk(aTalk)

    assertFalse(openSpace.hasTalksToScheduled())
  }

  @Test
  fun `an openSpace removes a talk that is to be assigned in slot`() {
    val organizer = UserSampler.get()
    val talkToDelete =
      TalkSampler.getWith(id = 15, name = "Talk", speaker = organizer)
    val aSlot = SlotSampler.getTalkSlot()
    val aRoom = Room("Sala")
    val assignedSlotToDelete1 = AssignedSlot(
      talk = talkToDelete,
      slot = aSlot,
      room = aRoom
    )
    val talkNotToDelete = TalkSampler.get()
    val assignedSlotNotDelete = AssignedSlot(
      talk = talkNotToDelete,
      slot = aSlot,
      room = aRoom
    )
    val assignedSlotToDelete2 = AssignedSlot(
      talk = talkToDelete,
      slot = aSlot,
      room = aRoom
    )
    val openSpace = OpenSpaceSampler.getWith(
      organizer = organizer,
      talks = mutableSetOf(talkToDelete, talkNotToDelete),
      slots = mutableSetOf(aSlot),
      rooms = mutableSetOf(aRoom),
      assignedSlots = mutableSetOf(
        assignedSlotToDelete1,
        assignedSlotNotDelete,
        assignedSlotToDelete2
      ),
    )

    // WHEN
    openSpace.removeTalk(talkToDelete)

    //THEN
    assertEquals(1, openSpace.talks.size)
    assertTrue(openSpace.talks.contains(talkNotToDelete))
    assertEquals(1, openSpace.assignedSlots.size)
    assertTrue(openSpace.assignedSlots.contains(assignedSlotNotDelete))

  }

  @Test
  fun `a user that is not the organizer cant update the open space`() {
    val aUser = anyUser()
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    assertThrows<NotTheOrganizerException> {
      openSpace.update(aUser, "a new name", "")
    }
  }

  @Test
  fun `an open space starts with inactive voting`() {
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    assertFalse(openSpace.isActiveVoting)
  }

  @ParameterizedTest
  @CsvSource(
    "true,false",
    "false,true"
  )
  fun `test GIVEN an open space WHEN toggleVoting with organizer user THEN should switch isActiveVoting`(
    isActiveVoting: Boolean, expectedActiveRes: Boolean
  ) {

    val organizer = UserSampler.get()
    val openSpace = OpenSpaceSampler.getWith(
      isActiveVoting = isActiveVoting,
      organizer = organizer
    )

    openSpace.toggleVoting(organizer)

    assertEquals(expectedActiveRes, openSpace.isActiveVoting)
  }

  @Test
  fun `a user thats not the organizer cant toggle voting`() {
    val aUser = anyUser()
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    assertThrows<NotTheOrganizerException> {
      openSpace.toggleVoting(aUser)
    }
  }

  @ParameterizedTest
  @CsvSource(
    "true,false",
    "false,true"
  )
  fun `test GIVEN an open space WHEN toggleVoting with organizer user THEN should switch showSpeakerName`(
    isShowSpeakerName: Boolean, expectedShowSpeakerName: Boolean
  ) {

    val organizer = UserSampler.get()
    val openSpace = OpenSpaceSampler.getWith(
      isShowSpeakerName = isShowSpeakerName,
      organizer = organizer
    )

    openSpace.toggleShowSpeakerName(organizer)

    assertEquals(expectedShowSpeakerName, openSpace.showSpeakerName)
  }

  @Test
  fun `an open space hides the speaker name`() {
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    openSpace.toggleShowSpeakerName(organizer)

    assertFalse(openSpace.showSpeakerName)
  }

  @Test
  fun `a user thats not the organizer cant toggle show speaker name`() {
    val aUser = anyUser()
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    assertThrows<NotTheOrganizerException> {
      openSpace.toggleShowSpeakerName(aUser)
    }
  }

  @Test
  fun `test toString`() {
    val organizer = anyUser()
    val openSpace = anyOpenSpaceWith(organizer)

    val expectedStr =
      "OpenSpace(assignedSlots=[], description=, id=0, isActiveCallForPapers=false, isActiveVoting=false, " +
        "name=os, organizer=User(email=augusto@sos.sos, id=0, name=augusto, password=***, resetToken=***, " +
        "resetTokenLifetime=***), queue=[], queueState=PENDING, rooms=[], showSpeakerName=true, " +
        "slots=[TalkSlot(date=2007-12-03, endTime=10:00, id=0, startTime=09:00), TalkSlot(date=2007-12-03, " +
        "endTime=11:00, id=0, startTime=10:00), TalkSlot(date=2007-12-03, endTime=12:00, id=0, startTime=11:00)], " +
        "talks=[], toSchedule=[], tracks=[], urlImage=)"
    assertEquals(expectedStr, openSpace.toString())
  }

  @Test
  fun `GIVEN OpenSpace with empty slots WHEN startTime THEN null`() {
    val openSpace = OpenSpaceSampler.get()

    val res = openSpace.startTime()
    assertNull(res)
  }

  @Test
  fun `test GIVEN OpenSpace with many slots WHEN startTime THEN get min startTime`() {

    val fstTalk = SlotSampler.getTalkSlotWith(
      startTime = LocalTime.of(13, 0),
      date = LocalDate.of(2025, 12, 1)
    )
    val sndTalk = SlotSampler.getTalkSlotWith(
      startTime = LocalTime.of(9, 0),
      date = LocalDate.of(2025, 12, 2)
    )
    val trdTalk = SlotSampler.getTalkSlotWith(
      startTime = LocalTime.of(10, 0),
      date = LocalDate.of(2025, 12, 3)
    )
    val forthTalk = SlotSampler.getOtherSlotWith(
      startTime = LocalTime.of(13, 0),
      date = LocalDate.of(2025, 12, 3)
    )
    val openSpace = OpenSpaceSampler.getWith(
      slots = mutableSetOf(
        trdTalk,
        sndTalk,
        fstTalk,
        forthTalk
      )
    )

    val res = openSpace.startTime()
    //TODO: Review if it is ok? Or return LocalDateTime with real min date+time?
    val expectedMinTime = LocalTime.of(9, 0)
    assertEquals(expectedMinTime, res)
  }

  @Test
  fun `GIVEN OpenSpace with empty slots WHEN endTime THEN null`() {
    val openSpace = OpenSpaceSampler.get()

    val res = openSpace.endTime()
    assertNull(res)
  }

  @Test
  fun `test GIVEN OpenSpace with many slots WHEN endTime THEN get max endTime`() {

    val fstTalk = SlotSampler.getTalkSlotWith(
      endTime = LocalTime.of(13, 0),
      date = LocalDate.of(2025, 12, 1)
    )
    val sndTalk = SlotSampler.getTalkSlotWith(
      endTime = LocalTime.of(9, 0),
      date = LocalDate.of(2025, 12, 2)
    )
    val trdTalk = SlotSampler.getTalkSlotWith(
      endTime = LocalTime.of(10, 0),
      date = LocalDate.of(2025, 12, 3)
    )
    val forthTalk = SlotSampler.getOtherSlotWith(
      endTime = LocalTime.of(12, 0),
      date = LocalDate.of(2025, 12, 3)
    )
    val openSpace = OpenSpaceSampler.getWith(
      slots = mutableSetOf(
        trdTalk,
        sndTalk,
        fstTalk,
        forthTalk
      )
    )

    val res = openSpace.endTime()
    //TODO: Review if it is ok? Or return LocalDateTime with real max date+time?
    val expectedMinTime = LocalTime.of(13, 0)
    assertEquals(expectedMinTime, res)
  }

  @Test
  fun `test GIVEN OpenSpace with no rooms or no assignable slots WHEN assignableSlots THEN return empty list`() {

    val osWithNoSlotsAndNoRooms = OpenSpaceSampler.getWith(
      rooms = mutableSetOf(),
      slots = mutableSetOf()
    )

    val osWithNoAssignableSlots = OpenSpaceSampler.getWith(
      rooms = mutableSetOf(RoomSampler.getWith(name = "Room 1")),
      slots = mutableSetOf(SlotSampler.getOtherSlot())
    )
    val osWithNoRooms = OpenSpaceSampler.getWith(
      rooms = mutableSetOf(),
      slots = mutableSetOf(SlotSampler.getTalkSlot())
    )

    assertTrue(osWithNoSlotsAndNoRooms.assignableSlots().isEmpty())
    assertTrue(osWithNoAssignableSlots.assignableSlots().isEmpty())
    assertTrue(osWithNoRooms.assignableSlots().isEmpty())
  }

  @Test
  fun `test GIVEN OpenSpace with rooms and assignable slots WHEN assignableSlots THEN return expected list`() {

    val room1 = RoomSampler.getWith(id = 1L, name = "Room 1")
    val room2 = RoomSampler.getWith(id = 15L, name = "Room 2")
    val rooms = mutableSetOf(
      room1,
      room2,
    )
    val assignableSlot1 = SlotSampler.getTalkSlotWith()
    val assignableSlot2 = SlotSampler.getTalkSlotWith()
    val slots: MutableSet<Slot> = mutableSetOf(
      assignableSlot1,
      SlotSampler.getOtherSlot(),
      assignableSlot2
    )
    val openSpace = OpenSpaceSampler.getWith(
      rooms = rooms,
      slots = slots
    )
    // WHEN
    val res = openSpace.assignableSlots()


    // THEN
    assertEquals(2, res.size)

    val resultRooms = res.map { it.first }
    assertTrue(resultRooms.containsAll(rooms))

    //TODO: Review is ok to return all rooms with every repeated assignable slots??
    val expectedAssignableSlots = mutableSetOf(assignableSlot1, assignableSlot2)
    val resultAssignableSlots = res.map { it.second }
    assertTrue(resultAssignableSlots.all {
      it.containsAll(
        expectedAssignableSlots
      )
    })
  }

  @Test
  fun `test OpenSpace hasAssignedSlots should be falsy`() {
    val openSpace = OpenSpaceSampler.getWith()

    assertFalse(openSpace.hasAssignedSlots())
  }

  @Test
  fun `test OpenSpace hasAssignedSlots should be truthy`() {
    val assignedSlot = AssignedSlot(
      talk = TalkSampler.get(),
      slot = SlotSampler.getTalkSlot(),
      room = RoomSampler.get()
    )
    val openSpace = OpenSpaceSampler.getWith(
      assignedSlots = mutableSetOf(assignedSlot)
    )

    assertTrue(openSpace.hasAssignedSlots())
  }

  @Test
  fun `test GIVEN openSpace WHEN exchangeSlot with a slot which is not match THEN throws SlotNotFoundException`() {
    val talk = TalkSampler.get()
    val slot = SlotSampler.getTalkSlot()
    val currentRoom = RoomSampler.getWith(id = 1L, name = "Room 1")
    val assignableSlot = AssignedSlot(
      talk = talk,
      slot = slot,
      room = currentRoom,
    )
    val openSpace = OpenSpaceSampler.getWith(
      assignedSlots = mutableSetOf(assignableSlot)
    )
    val newRoom = RoomSampler.getWith(id = 15L, name = "Room 2")

    // WHEN + THEN
    assertThrows<SlotNotFoundException> {
      openSpace.exchangeSlot(talk, newRoom, slot)
    }
  }

  @Test
  fun `test GIVEN openSpace WHEN exchangeSlot with a talk which is not scheduled THEN throws TalkIsNotScheduledException`() {
    val talk = TalkSampler.get()
    val slot = SlotSampler.getTalkSlot()
    val openSpace = OpenSpaceSampler.getWith(
      slots = mutableSetOf(slot),
      assignedSlots = mutableSetOf()
    )
    val newRoom = RoomSampler.getWith(id = 15L, name = "Room 2")

    // WHEN + THEN
    assertThrows<TalkIsNotScheduledException> {
      openSpace.exchangeSlot(talk, newRoom, slot)
    }
  }

  @Test
  fun `test GIVEN openSpace which only assignableSlot WHEN exchangeSlot THEN only set assign new slot and room`() {
    val talk = TalkSampler.get()
    val currentSlot = SlotSampler.getTalkSlotWith(
      startTime = LocalTime.of(10, 0),
      endTime = LocalTime.of(11, 0),
      date = LocalDate.of(2025, 12, 1)
    )
    val currentRoom = RoomSampler.getWith(id = 1L, name = "Room 1")
    val assignableSlot = AssignedSlot(
      talk = talk,
      slot = currentSlot,
      room = currentRoom,
    )
    val newSlot = SlotSampler.getTalkSlotWith(
      startTime = LocalTime.of(11, 0),
      endTime = LocalTime.of(12, 0),
      date = LocalDate.of(2025, 12, 1)
    )
    val newRoom = RoomSampler.getWith(id = 15L, name = "Room 2")
    val openSpace = OpenSpaceSampler.getWith(
      slots = mutableSetOf(currentSlot, newSlot),
      rooms = mutableSetOf(currentRoom, newRoom),
      assignedSlots = mutableSetOf(assignableSlot)
    )

    // WHEN
    openSpace.exchangeSlot(talk, newRoom, newSlot)

    // THEN
    assertEquals(1, openSpace.assignedSlots.size)
    assertEquals(newSlot, openSpace.assignedSlots.first().slot)
    assertEquals(newRoom, openSpace.assignedSlots.first().room)
    assertEquals(talk, openSpace.assignedSlots.first().talk)
  }

  @Test
  fun `test GIVEN openSpace which can exchange slot WHEN exchangeSlot THEN exchange expected slot`() {
    // Assigned slot A to be exchanged
    val talkA = TalkSampler.getWith(id = 1L, name = "Talk A")
    val exchangeSlotA = SlotSampler.getTalkSlotWith(
      startTime = LocalTime.of(10, 0),
      endTime = LocalTime.of(11, 0),
      date = LocalDate.of(2025, 12, 1)
    )
    val exchangeRoomA = RoomSampler.getWith(id = 1L, name = "Room A")
    val assignableSlotA = AssignedSlot(
      talk = talkA,
      slot = exchangeSlotA,
      room = exchangeRoomA,
    )

    // Assigned slot B to be exchanged
    val talkB = TalkSampler.getWith(id = 2L, name = "Talk B")
    val exchangeSlotB = SlotSampler.getTalkSlotWith(
      startTime = LocalTime.of(11, 0),
      endTime = LocalTime.of(12, 0),
      date = LocalDate.of(2025, 12, 1)
    )
    val exchangeRoomB = RoomSampler.getWith(id = 15L, name = "Room B")
    val assignedSlotB = AssignedSlot(
      talk = talkB,
      slot = exchangeSlotB,
      room = exchangeRoomB,
    )


    val openSpace = OpenSpaceSampler.getWith(
      slots = mutableSetOf(exchangeSlotA, exchangeSlotB),
      rooms = mutableSetOf(exchangeRoomA, exchangeRoomB),
      assignedSlots = mutableSetOf(assignableSlotA, assignedSlotB)
    )

    // WHEN
    openSpace.exchangeSlot(talkB, exchangeRoomA, exchangeSlotA)

    // THEN
    assertEquals(2, openSpace.assignedSlots.size)

    val resAssignedSlotA = openSpace.assignedSlots.find { it.talk == talkA }!!
    assertEquals(exchangeSlotB, resAssignedSlotA.slot)
    assertEquals(exchangeRoomB, resAssignedSlotA.room)

    val resAssignedSlotB = openSpace.assignedSlots.find { it.talk == talkB }!!
    assertEquals(exchangeSlotA, resAssignedSlotB.slot)
    assertEquals(exchangeRoomA, resAssignedSlotB.room)
  }

  @Test
  fun `test GIVEN new open space WHEN hasTalksToScheduled THEN should be falsy`() {
    val openSpace = OpenSpaceSampler.get()

    assertFalse(openSpace.hasTalksToScheduled())
  }

  @Test
  fun `test GIVEN new open space with toSchedule talks WHEN hasTalksToScheduled THEN should be truthy`() {
    val aTalk = TalkSampler.get()
    val openSpace = OpenSpaceSampler.getWith(
      toScheduleTalks = mutableSetOf(aTalk)
    )

    assertTrue(openSpace.hasTalksToScheduled())
  }

  @Test
  fun `test GIVEN new open space WHEN hasQueuedTalks THEN should be falsy`() {
    val openSpace = OpenSpaceSampler.get()

    assertFalse(openSpace.hasQueuedTalks())
  }

  @Test
  fun `test GIVEN new open space with queue talks WHEN hasQueuedTalks THEN should be truthy`() {
    val aTalk = TalkSampler.get()
    val openSpace = OpenSpaceSampler.getWith(
      queueTalks = mutableListOf(aTalk)
    )

    assertTrue(openSpace.hasQueuedTalks())
  }

  @Test
  fun `test GIVEN openSpace with no assigned slots WHEN removeInvalidAssignedSlots THEN should not remove anything`() {
    val openSpace = OpenSpaceSampler.getWith(
      rooms = mutableSetOf(),
      slots = mutableSetOf(),
      assignedSlots = mutableSetOf()
    )

    openSpace.removeInvalidAssignedSlots()

    assertEquals(0, openSpace.assignedSlots.size)
  }

  @Test
  fun `test GIVEN openSpace with valid and invalid assigned slots WHEN removeInvalidAssignedSlots THEN should remove all invalid assignedSlots`() {

    val validRoom = RoomSampler.getWith(id = 33, name = "Room 33")
    val validSlot = SlotSampler.getTalkSlotWith(id = 5)
    val validAssignedSlot = AssignedSlot(
      talk = TalkSampler.get(),
      slot = validSlot,
      room = validRoom
    )
    val invalidAssignedSlot1 = AssignedSlot(
      talk = TalkSampler.get(),
      slot = SlotSampler.getTalkSlotWith(id = 76),
      room = RoomSampler.getWith(id = 11)
    )
    val invalidAssignedSlot2 = AssignedSlot(
      talk = TalkSampler.get(),
      slot = SlotSampler.getTalkSlotWith(id = 88),
      room = validRoom
    )

    val invalidAssignedSlot3 = AssignedSlot(
      talk = TalkSampler.get(),
      slot = validSlot,
      room = RoomSampler.getWith(id = 666)
    )
    val openSpace = OpenSpaceSampler.getWith(
      rooms = mutableSetOf(validRoom),
      slots = mutableSetOf(validSlot),
      assignedSlots = mutableSetOf(
        invalidAssignedSlot2,
        validAssignedSlot,
        invalidAssignedSlot1,
        invalidAssignedSlot3
      )
    )

    // WHEN
    openSpace.removeInvalidAssignedSlots()


    //THEN
    assertEquals(1, openSpace.assignedSlots.size)
  }

  @Test
  fun `test freeSlots should return expected free slots`() {
    val room1 = RoomSampler.getWith(id = 1, name = "Room 1")
    val room2 = RoomSampler.getWith(id = 2, name = "Room 2")
    val room3 = RoomSampler.getWith(id = 3, name = "Room 3")

    val assignableSlot1 = SlotSampler.getTalkSlotWith(
      id = 1,
      startTime = LocalTime.of(9, 0),
      date = LocalDate.of(2025, 12, 1)
    )
    val assignableSlot2 = SlotSampler.getTalkSlotWith(
      id = 2,
      startTime = LocalTime.of(10, 0),
      date = LocalDate.of(2025, 12, 1)
    )
    val assignableSlot3 = SlotSampler.getTalkSlotWith(
      id = 3,
      startTime = LocalTime.of(9, 0),
      date = LocalDate.of(2025, 12, 2)
    )
    val openSpace = OpenSpaceSampler.getWith(
      rooms = mutableSetOf(room1, room2, room3),
      slots = mutableSetOf(
        assignableSlot1,
        SlotSampler.getOtherSlotWith(id = 11),
        assignableSlot2,
        assignableSlot3,
        SlotSampler.getOtherSlotWith(id = 16),
      ),
      assignedSlots = mutableSetOf(
        AssignedSlot(
          talk = TalkSampler.get(),
          slot = assignableSlot1,
          room = room1
        ),
        AssignedSlot(
          talk = TalkSampler.get(),
          slot = assignableSlot2,
          room = room2
        ),
        AssignedSlot(
          talk = TalkSampler.get(),
          slot = assignableSlot3,
          room = room1
        ),
        AssignedSlot(
          talk = TalkSampler.get(),
          slot = assignableSlot2,
          room = room1
        )
      )
    )

    // WHEN
    val resFreeSlots = openSpace.freeSlots()

    // THEN
    assertEquals(2, resFreeSlots.size)

    val resRooms = resFreeSlots.map { it.first }
    assertTrue(resRooms.containsAll(setOf(room2, room3)))

    val resSlotsOfRoom2 = resFreeSlots.find { it.first == room2 }!!.second
    assertEquals(2, resSlotsOfRoom2.size)
    assertTrue(
      resSlotsOfRoom2.containsAll(
        setOf(
          assignableSlot1,
          assignableSlot3
        )
      )
    )

    val resSlotsOfRoom3 = resFreeSlots.find { it.first == room3 }!!.second
    assertEquals(3, resSlotsOfRoom3.size)
    assertTrue(
      resSlotsOfRoom3.containsAll(
        setOf(
          assignableSlot1,
          assignableSlot2,
          assignableSlot3
        )
      )
    )


  }

  private fun createAndEnqueueTalk(
    openSpace: OpenSpace,
    organizer: User,
    aTalk: Talk
  ) {
    openSpace.toggleCallForPapers(organizer)
    openSpace.addTalk(aTalk)
    openSpace.activeQueue(organizer)
    openSpace.enqueueTalk(aTalk)
  }

  private fun createATalkThatIsToBeScheduled(
    openSpace: OpenSpace,
    organizer: User,
    aTalk: Talk
  ) {
    openSpace.toggleCallForPapers(organizer)
    openSpace.addTalk(aTalk)
    openSpace.activeQueue(organizer)
    openSpace.enqueueTalk(aTalk)
    openSpace.nextTalk(organizer)
  }

  private fun createAndScheduleTalk(
    openSpace: OpenSpace,
    organizer: User,
    aTalk: Talk,
    aSlot: TalkSlot,
    aRoom: Room
  ) {
    openSpace.toggleCallForPapers(organizer)
    openSpace.addTalk(aTalk)
    openSpace.scheduleTalk(aTalk, organizer, aSlot, aRoom)
  }

  private fun openSpaceWithTwoDates(
    startDate: LocalDate,
    endDate: LocalDate
  ): OpenSpace {
    val first_date_slot =
      TalkSlot(LocalTime.of(9, 0), LocalTime.of(10, 0), startDate)
    val end_date_slot =
      TalkSlot(LocalTime.of(9, 0), LocalTime.of(10, 0), endDate)
    val openSpace = OpenSpace(
      name = "os",
      rooms = mutableSetOf(),
      slots = mutableSetOf(first_date_slot, end_date_slot),
      talks = mutableSetOf()
    )
    return openSpace
  }

  private fun anyOpenSpace(talks: MutableSet<Talk> = mutableSetOf()) =
    OpenSpace(
      "os", mutableSetOf(), mutableSetOf(
        TalkSlot(
          LocalTime.parse("09:00"),
          LocalTime.parse("10:00"),
          LocalDate.parse("2007-12-03")
        ),
        TalkSlot(
          LocalTime.parse("10:00"),
          LocalTime.parse("11:00"),
          LocalDate.parse("2007-12-03")
        ),
        TalkSlot(
          LocalTime.parse("11:00"),
          LocalTime.parse("12:00"),
          LocalDate.parse("2007-12-03")
        )
      ),
      talks
    )

  private fun anyOpenSpaceWith(organizer: User): OpenSpace {
    val openSpace = anyOpenSpace()
    organizer.addOpenSpace(openSpace)
    return openSpace
  }

  private fun anyUser(
    openSpaces: MutableSet<OpenSpace> = mutableSetOf(),
    talks: MutableSet<Talk> = mutableSetOf()
  ): User {
    val user = User("augusto@sos.sos", "augusto", "Augusto")
    openSpaces.forEach { user.addOpenSpace(it) }
    return user
  }
}
