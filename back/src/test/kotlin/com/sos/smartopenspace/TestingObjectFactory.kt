package com.sos.smartopenspace

import com.sos.smartopenspace.domain.*
import com.sos.smartopenspace.persistence.OpenSpaceRepository
import com.sos.smartopenspace.persistence.TalkRepository
import com.sos.smartopenspace.persistence.UserRepository
import java.time.LocalDate
import java.time.LocalTime

fun anOpenSpace(
        slots: Set<Slot> = setOf(
        TalkSlot(LocalTime.parse("09:00"), LocalTime.parse("09:30"), LocalDate.now()),
        TalkSlot(LocalTime.parse("09:30"), LocalTime.parse("10:45"), LocalDate.now()) ,
        TalkSlot(LocalTime.parse("10:45"), LocalTime.parse("11:00"), LocalDate.now())
    ),
        name: String = "os",
        rooms: Set<Room> = setOf(Room("1")),
        tracks: Set<Track> = emptySet(),
        description: String = "",
        talks: MutableSet<Talk> = mutableSetOf()
): OpenSpace {
    return OpenSpace(
      name = name,
      rooms = rooms.toMutableSet(),
      slots = slots.toMutableSet(),
      talks = talks,
      description = description,
      tracks = tracks.toMutableSet()
    )
}

fun aSavedTalk(talkRepository: TalkRepository, repoOpenSpace: OpenSpaceRepository, repoUser: UserRepository): Talk {
    val openSpace = anOpenSpace()
    repoOpenSpace.save(openSpace)
    val user = aUser()
    repoUser.save(user)
    user.addOpenSpace(openSpace)
    openSpace.toggleCallForPapers(user)
    val aTalk = Talk("a name", description = "first description")
    openSpace.addTalk(aTalk)
    user.addTalk(aTalk)
    talkRepository.save(aTalk)
    return aTalk
}

fun generateTalkBody(name: String = "asdf", description: String = "a generic description", aMeeting: String = "http://aGenericLink.com"): String {
    return """
            {
                "name": "${name}",
                "description": "${description}",
                "meetingLink": "${aMeeting}"
            }
        """.trimIndent()
}

fun anOpenSpaceWith(
        talk: Talk,
        organizer: User,
        slots: Set<Slot> = setOf(
                TalkSlot(LocalTime.parse("09:00"), LocalTime.parse("09:30"), LocalDate.now()),
                TalkSlot(LocalTime.parse("09:30"), LocalTime.parse("10:45"), LocalDate.now()),
                TalkSlot(LocalTime.parse("10:45"), LocalTime.parse("11:00"), LocalDate.now())),
        rooms: Set<Room> = setOf(Room("Sala"))
): OpenSpace {
    val openSpace = anOpenSpace(talks = mutableSetOf(talk), slots = slots, rooms = rooms)
    organizer.addOpenSpace(openSpace)
    return openSpace
}

fun aUser(openSpaces: MutableSet<OpenSpace> = mutableSetOf(), talks: MutableSet<Talk> = mutableSetOf()) =
        User("apprentices@sos.sos", "apprentices", "apprentices", openSpaces, talks)