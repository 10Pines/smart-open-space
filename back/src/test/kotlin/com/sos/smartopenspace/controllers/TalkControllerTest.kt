package com.sos.smartopenspace.controllers

import com.jayway.jsonpath.JsonPath
import com.sos.smartopenspace.domain.*
import com.sos.smartopenspace.persistence.OpenSpaceRepository
import com.sos.smartopenspace.persistence.RoomRepository
import com.sos.smartopenspace.persistence.TalkRepository
import com.sos.smartopenspace.persistence.UserRepository
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalTime

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class TalkControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc


    @Autowired
    lateinit var userRepository: UserRepository
    @Autowired
    lateinit var openSpaceRepository: OpenSpaceRepository
    @Autowired
    lateinit var talkRepository: TalkRepository
    @Autowired
    lateinit var roomRepository: RoomRepository

    @Test
    fun `schedule a valid talk returns an ok status response`() {
        val organizer = userRepository.save(User("augusto@sos.sos", "augusto", "Augusto", mutableSetOf()))
        val talk = talkRepository.save(Talk("Charla"))
        val room = roomRepository.save(Room("Sala"))
        openSpaceRepository.save(anyOpenSpaceWith(talk, organizer, room))
        val time = LocalTime.parse("09:30")

        mockMvc.perform(
                MockMvcRequestBuilders.put("/talk/schedule/${organizer.id}/${talk.id}/${room.id}/${time}")
        ).andExpect(MockMvcResultMatchers.status().isOk)

    }

    @Test
    fun `schedule a invalid talk returns a bad request response`() {
        val organizer = userRepository.save(User("augusto@sos.sos", "augusto", "Augusto", mutableSetOf()))
        val talk = talkRepository.save(Talk("Charla"))
        val speaker = userRepository.save(anyUser(talk))
        val room = roomRepository.save(Room("Sala"))
        openSpaceRepository.save(anyOpenSpaceWith(talk, organizer, room))
        val time = LocalTime.parse("09:30")

        mockMvc.perform(
                MockMvcRequestBuilders.put("/talk/schedule/${speaker.id}/${talk.id}/${room.id}/${time}")
        ).andExpect(MockMvcResultMatchers.status().isBadRequest)
    }

    private fun anyOpenSpaceWith(talk: Talk, organizer: User, room: Room): OpenSpace {
        val os = anyOS(mutableSetOf(talk), room)
        organizer.addOpenSpace(os)
        return os
    }

    private fun anyOS(talks: MutableSet<Talk> = mutableSetOf(Talk("charla")), room: Room) = OpenSpace(
            "os", LocalDate.now(), setOf(room),
            setOf(
                    TalkSlot(LocalTime.parse("09:00"), LocalTime.parse("09:30")),
                    TalkSlot(LocalTime.parse("09:30"), LocalTime.parse("10:45")),
                    TalkSlot(LocalTime.parse("10:45"), LocalTime.parse("12:00"))
            ), talks
    )

    private fun anyUser(talk: Talk) = User("ximena@sos.sos", "Ximena", "ximena", mutableSetOf(), mutableSetOf(talk))
}