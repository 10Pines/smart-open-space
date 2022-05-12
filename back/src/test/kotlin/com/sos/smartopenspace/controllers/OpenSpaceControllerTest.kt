package com.sos.smartopenspace.controllers

import com.jayway.jsonpath.JsonPath
import com.sos.smartopenspace.domain.*
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
class OpenSpaceControllerTest {
    private fun anyUser(oss: MutableSet<OpenSpace> = mutableSetOf(), talks: MutableSet<Talk> = mutableSetOf()) =
        User("augusto@sos.sos", "augusto", "Augusto", oss, talks)

    @Autowired
    lateinit var mockMvc: MockMvc


    @Autowired
    lateinit var repoUser: UserRepository

    @Test
    fun `creating a valid OpenSpace returns an ok status response`() {
        val user = repoUser.save(anyUser())
        val description = "W".repeat(1000)
        val openSpaceBody = generateCreateBody(description)
        val entityResponse = mockMvc.perform(
            MockMvcRequestBuilders.post("/openSpace/${user.id}")
                .contentType("application/json")
                .content(openSpaceBody)
        ).andReturn().response
        val id = JsonPath.read<Int>(entityResponse.contentAsString, "$.id")
        mockMvc.perform(
            MockMvcRequestBuilders.get("/openSpace/${id}")
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.description").value(description))
    }

    @Test
    fun `creating an invalid OpenSpace returns a bad request response`() {
        val user = repoUser.save(anyUser())
        val openSpaceBody = generateCreateBody("W".repeat(1001))
        mockMvc.perform(
            MockMvcRequestBuilders.post("/openSpace/${user.id}")
                .contentType("application/json")
                .content(openSpaceBody)
        )
            .andExpect(MockMvcResultMatchers.status().isBadRequest)
    }

    private fun anyOpenSpace(): OpenSpace {
        return OpenSpace(
            "os", LocalDate.now(), setOf(Room("1")),
            setOf(
                TalkSlot(LocalTime.parse("09:00"), LocalTime.parse("09:30"))
            )
        )
    }

    private fun generateCreateBody(description: String): String {
        return """
{
    "date": "2022-05-11T03:00:00.000Z",
    "name": "asd",
    "description": "${description}",
    "rooms": [{"name": "a"}],
    "slots": [
        {
            "type": "TalkSlot",
            "endTime": [
                0,
                15
            ],
            "startTime": [
                0,
                0
            ]
        }
    ]
}
        """.trimIndent()
    }
}