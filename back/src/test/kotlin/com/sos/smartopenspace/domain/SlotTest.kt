package com.sos.smartopenspace.domain

import com.sos.smartopenspace.anOpenSpace
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertIterableEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.time.LocalTime

class SlotTest {
    private val user = User("anemail@gmail.com", "Pepe")
    private val room1 = Room("1")
    private val talk1 = Talk("talk1", speaker = user)
    private val talk2 = Talk("talk2", speaker = user)
    private val aSlot =
        TalkSlot(LocalTime.parse("09:00"), LocalTime.parse("09:30"), LocalDate.now())
    private val otherSlot =
        TalkSlot(LocalTime.parse("09:30"), LocalTime.parse("09:45"), LocalDate.now())
    private val secondDaySlot =
        TalkSlot(LocalTime.parse("09:00"), LocalTime.parse("09:30"), LocalDate.now().plusDays(1))

    private fun anyUser(): User {
        return User("augusto@sos.sos", "Augusto", "Augusto")
    }

    private fun anyOpenSpaceWithActiveQueued(
        talks: Set<Talk>,
        slots: Set<Slot> = setOf(
            aSlot,
            otherSlot,
            secondDaySlot
        )
    ): OpenSpace {
        val openSpace =
            anOpenSpace(talks = talks.toMutableSet(), rooms = setOf(room1), slots = slots)
        val organizer = anyUser()
        organizer.addOpenSpace(openSpace)
        openSpace.activeQueue(organizer)
        talks.forEach {
            anyUser()
            openSpace.enqueueTalk(it)
            openSpace.nextTalk(organizer)
        }
        return openSpace
    }

    private fun anyOpenSpaceWithOrganizer(
        talks: MutableSet<Talk> = mutableSetOf(talk1, talk2)
    ): OpenSpace {
        val openSpace = anOpenSpace(
            talks = talks.toMutableSet(),
            rooms = setOf(room1),
            slots = setOf(aSlot, otherSlot)
        )
        val organizer = User("augusto@sos.sos", "augusto", "Augusto")
        organizer.addOpenSpace(openSpace)
        openSpace.activeQueue(organizer)
        return openSpace
    }

    @Test
    fun `Si una charla no esta para agendar, no se puede agendar`() {
        val openSpace = anyOpenSpaceWithOrganizer()
        assertThrows(TalkIsNotForScheduledException::class.java) {
            openSpace.scheduleTalk(talk1, anyUser(), aSlot, room1)
        }
    }

    @Test
    fun `El organizador puede agendar una charla siempre`() {
        val openSpace = anyOpenSpaceWithOrganizer()

        val slot = openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)

        assertTrue(slot.startAt(LocalTime.parse("09:00")))
        assertEquals(room1, slot.room)
        assertEquals(talk1, slot.talk)
    }

    @Test
    fun `Asignar una charla en un horario y en una sala`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1))
        val slot = openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        assertTrue(slot.startAt(LocalTime.parse("09:00")))
        assertEquals(room1, slot.room)
        assertEquals(talk1, slot.talk)
    }

    @Test
    fun `No se puede agendar una charla fuera de horario`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1), setOf(aSlot))
        assertThrows(SlotNotFoundException::class.java) {
            openSpace.scheduleTalk(talk1, openSpace.organizer, otherSlot, room1)
        }
    }

    @Test
    fun `Asignar una charla pero el slot esta ocupado`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1, talk2))
        openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        assertThrows(BusySlotException::class.java) {
            openSpace.scheduleTalk(talk2, openSpace.organizer, aSlot, room1)
        }
    }

    @Test
    fun `Asignar una charla que no pertenece al open space`() {
        val openSpace = anyOpenSpaceWithOrganizer()
        assertThrows(TalkDoesntBelongException::class.java) {
            val talk = Talk("otra", speaker = user)
            openSpace.scheduleTalk(talk, anyUser(), aSlot, room1)
        }
    }

    @Test
    fun `Asignar una charla que ya se encuentra asignada`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1))
        openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        assertThrows(TalkAlreadyAssignedException::class.java) {
            openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        }
    }

    @Test
    fun `Open space sin charlas agendadas, tiene los slots libres`() {
        val openSpace = anOpenSpace(talks = mutableSetOf(talk1, talk2), rooms = setOf(room1))
        val freeSlots = openSpace.freeSlots()
        assertIterableEquals(
            listOf(LocalTime.parse("09:00"), LocalTime.parse("09:30"), LocalTime.parse("10:45")),
            slotStartTimes(freeSlots)
        )
    }

    @Test
    fun `Asignar una charlas, ese slot no esta mas libre`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1), setOf(aSlot, otherSlot))
        openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        val freeSlots = openSpace.freeSlots()
        assertFalse(slotStartTimes(freeSlots).contains(LocalTime.parse("09:00")))
    }

    @Test
    fun `Todos los slots asignados no quedan lugares libres`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1), setOf(aSlot))
        openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        val freeSlots = openSpace.freeSlots()
        assertTrue(freeSlots.isEmpty())
    }

    @Test
    fun `Cambiar charla de slot a uno vacio`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1))
        openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        openSpace.exchangeSlot(talk1, room1, otherSlot)
        val freeSlots = openSpace.freeSlots()
        assertTrue(slotStartTimes(freeSlots).contains(LocalTime.parse("09:00")))
        assertFalse(slotStartTimes(freeSlots).contains(LocalTime.parse("09:30")))
    }

    @Test
    fun `Cambiar charla de slot a uno vacio en otra fecha`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1))
        openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        openSpace.exchangeSlot(talk1, room1, secondDaySlot)
        val freeSlots = openSpace.freeSlots()
        assertTrue(slotDate(freeSlots).contains(aSlot.date))
        assertFalse(slotDate(freeSlots).contains(secondDaySlot.date))
    }

    @Test
    fun `Cambiar charla de slot a uno ocupado`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1, talk2), setOf(aSlot, otherSlot))
        openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        openSpace.scheduleTalk(talk2, openSpace.organizer, otherSlot, room1)
        openSpace.exchangeSlot(talk1, room1, otherSlot)
        assertEquals(
            talk1,
            openSpace.assignedSlots.find { it.room == room1 && it.startAt(LocalTime.parse("09:30")) }?.talk
        )
        assertEquals(
            talk2,
            openSpace.assignedSlots.find { it.room == room1 && it.startAt(LocalTime.parse("09:00")) }?.talk
        )
    }

    @Test
    fun `Cambiar charla de slot a uno ocupado en otra fecha`() {
        val openSpace = anyOpenSpaceWithActiveQueued(
            setOf(talk1, talk2),
            setOf(aSlot, otherSlot, secondDaySlot)
        )
        openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        openSpace.scheduleTalk(talk2, openSpace.organizer, secondDaySlot, room1)
        openSpace.exchangeSlot(talk1, room1, secondDaySlot)
        assertEquals(
            talk1,
            openSpace.assignedSlots.find { it.room == room1 && it.hasDate(secondDaySlot.date) }?.talk
        )
        assertEquals(
            talk2,
            openSpace.assignedSlots.find { it.room == room1 && it.hasDate(aSlot.date) }?.talk
        )
    }

    @Test
    fun `Cambiar charla de slot pero la charla no esta agendada`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1))
        assertThrows(TalkIsNotScheduledException::class.java) {
            openSpace.exchangeSlot(talk1, room1, aSlot)
        }
    }

    @Test
    fun `Cambiar charla de slot a un horario inexistente`() {
        val openSpace = anyOpenSpaceWithActiveQueued(setOf(talk1))
        openSpace.scheduleTalk(talk1, openSpace.organizer, aSlot, room1)
        assertThrows(SlotNotFoundException::class.java) {
            openSpace.exchangeSlot(
                talk1,
                room1,
                TalkSlot(LocalTime.parse("10:00"), LocalTime.parse("10:30"), LocalDate.now())
            )
        }
    }

    @Test
    fun `TalkSlot toString`() {
        val talkSlot = TalkSlot(
            startTime = LocalTime.parse("09:00"),
            endTime = LocalTime.parse("09:30"),
            date = LocalDate.now()
        )

        val expectedRes = "TalkSlot(date=${talkSlot.date}, endTime=09:30, id=0, startTime=09:00)"
        assertEquals(expectedRes, talkSlot.toString())
    }

    @Test
    fun `OtherSlot toString`() {
        val otherSlot = OtherSlot(
            startTime = LocalTime.parse("09:00"),
            endTime = LocalTime.parse("09:30"),
            description = "A description",
            date = LocalDate.now()
        )
        val expectedRes =
            "OtherSlot(date=${otherSlot.date}, description=A description, endTime=09:30, id=0, startTime=09:00)"
        assertEquals(expectedRes, otherSlot.toString())
    }

    @Test
    fun `TalkSlot cloneWithDate`() {
        val originalSlotDate = LocalDate.now().plusDays(2)
        val originalSlot = TalkSlot(
            startTime = LocalTime.parse("09:00"),
            endTime = LocalTime.parse("09:30"),
            date = originalSlotDate
        )

        // WHEN
        val newDate = originalSlotDate.plusDays(1)
        val clonedSlot = originalSlot.cloneWithDate(newDate)

        assertEquals(newDate, clonedSlot.date)
        assertEquals(originalSlot.startTime, clonedSlot.startTime)
        assertEquals(originalSlot.endTime, clonedSlot.endTime)
    }

    @Test
    fun `OtherSlot cloneWithDate`() {
        val originalSlotDate = LocalDate.now().plusDays(2)
        val originalSlot = OtherSlot(
            startTime = LocalTime.parse("09:00"),
            endTime = LocalTime.parse("09:30"),
            date = originalSlotDate,
            description = "some description"
        )

        // WHEN
        val newDate = originalSlotDate.plusDays(1)
        val clonedSlot = originalSlot.cloneWithDate(newDate)


        // THEN
        assertTrue(clonedSlot is OtherSlot)
        val clonedSlotAsOther = clonedSlot as OtherSlot
        assertEquals(newDate, clonedSlotAsOther.date)
        assertEquals(originalSlot.startTime, clonedSlotAsOther.startTime)
        assertEquals(originalSlot.endTime, clonedSlotAsOther.endTime)
        assertEquals(originalSlot.description, clonedSlotAsOther.description)
    }

    @Test
    fun `OtherSlot isAssignable should be falsy`() {
        val otherSlot = OtherSlot(
            startTime = LocalTime.parse("09:00"),
            endTime = LocalTime.parse("09:30"),
            date = LocalDate.now().plusDays(2),
            description = "some description"
        )

        // WHEN
        val result = otherSlot.isAssignable()

        // THEN
        assertFalse(result)
    }

    private fun slotStartTimes(freeSlots: List<Pair<Room, List<Slot>>>) =
        freeSlots[0].second.map { it.startTime }

    private fun slotDate(freeSlots: List<Pair<Room, List<Slot>>>) =
        freeSlots[0].second.map { it.date }

}
