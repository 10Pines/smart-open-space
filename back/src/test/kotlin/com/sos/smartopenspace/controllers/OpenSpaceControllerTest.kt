package com.sos.smartopenspace.controllers

import com.jayway.jsonpath.JsonPath
import com.sos.smartopenspace.aUser
import com.sos.smartopenspace.anOpenSpace
import com.sos.smartopenspace.domain.*
import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import jakarta.ws.rs.core.HttpHeaders
import jakarta.ws.rs.core.MediaType
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.transaction.annotation.Transactional
import java.net.URI
import java.time.LocalDate
import java.time.LocalTime


@Transactional
class OpenSpaceControllerTest : BaseControllerTest() {

    @Test
    fun `creating a valid OpenSpace returns an ok status response`() {
        val user = userRepo.save(aUser())
        val description = "W".repeat(1000)
        val track_color = "#FFFFFF"
        val track_name = "a track"
        val track_description = "W".repeat(500)
        val openSpaceBody = anOpenSpaceCreationBody(
            description = description,
            track = Track(name = track_name, description = track_description, color = track_color)
        )

        val entityResponse = mockMvc.perform(
            MockMvcRequestBuilders.post("/openSpace/${user.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(openSpaceBody)
        ).andReturn().response
        val id = JsonPath.read<Int>(entityResponse.contentAsString, "$.id")

        mockMvc.perform(
            MockMvcRequestBuilders.get("/openSpace/${id}")
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.description").value(description))
            .andExpect(MockMvcResultMatchers.jsonPath("$.isActiveCallForPapers").value(false))
            .andExpect(MockMvcResultMatchers.jsonPath("$.tracks[0].color").value(track_color))
            .andExpect(MockMvcResultMatchers.jsonPath("$.tracks[0].name").value(track_name))
            .andExpect(
                MockMvcResultMatchers.jsonPath("$.tracks[0].description").value(track_description)
            )
            .andExpect(MockMvcResultMatchers.jsonPath("$.startDate").isNotEmpty)
            .andExpect(MockMvcResultMatchers.jsonPath("$.endDate").isNotEmpty)
            .andExpect(MockMvcResultMatchers.jsonPath("$.dates").isNotEmpty)
            .andExpect(MockMvcResultMatchers.jsonPath("$.showSpeakerName").value(true))
            .andExpect(MockMvcResultMatchers.jsonPath("$.isActiveVoting").value(false))
    }

    @Test
    fun `deleting an OpenSpace without token returns an unauthorized status response`() {
        val user = userRepo.save(aUser())
        val anOpenSpace = createOpenSpaceFor(user)

        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/user/${user.id}")
        )
            .andExpect(MockMvcResultMatchers.status().isUnauthorized)
    }

    @Test
    fun `deleting an OpenSpace returns an ok status response`() {
        val (user, bearerAuthToken) = registerAndGenerateAuthToken(aUser())
        val anOpenSpace = createOpenSpaceFor(user)


        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/user/${user.id}")
                .header(HttpHeaders.AUTHORIZATION, bearerAuthToken)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)

        assertThatTheUserHasNoOpenSpaces(user)
    }

    @Test
    fun `deleting an OpenSpace with an invalid user returns a forbidden response`() {
        val (user, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
        val (otherUser, bearerTokenOtherUser) = registerAndGenerateAuthToken(aUser(userEmail = "other_user@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(user)

        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/user/${otherUser.id}")
                .header(HttpHeaders.AUTHORIZATION, bearerTokenOtherUser)
        )
            .andExpect(MockMvcResultMatchers.status().isForbidden)
    }

    @Test
    fun `deleting an OpenSpace with an user which not match token returns a forbidden response`() {
        val (user, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
        val (_, bearerTokenOtherUser) = registerAndGenerateAuthToken(aUser(userEmail = "other_user@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(user)

        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/user/${user.id}")
                .header(HttpHeaders.AUTHORIZATION, bearerTokenOtherUser)
        ).andExpect(MockMvcResultMatchers.status().isForbidden)
    }

    @Test
    fun `creating an invalid OpenSpace returns a bad request response`() {
        val user = userRepo.save(aUser())
        val openSpaceBody = anOpenSpaceCreationBody("W".repeat(1001))
        mockMvc.perform(
            MockMvcRequestBuilders.post("/openSpace/${user.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(openSpaceBody)
        )
            .andExpect(MockMvcResultMatchers.status().isBadRequest)
    }

    @Test
    fun `can create a valid talk and get it correctly`() {
        val user = userRepo.save(aUser())
        val track = Track("a track", color = "#FFFFFF")
        val anOpenSpace = openSpaceRepo.save(anyOpenSpaceWith(user, setOf(track)))
        anOpenSpace.toggleCallForPapers(user)
        val aMeetingLink = "https://aLink"
        val aDocument = Document("a document", URI("https://www.lipsum.com/").toURL())

        mockMvc.perform(
            MockMvcRequestBuilders.post("/openSpace/talk/${user.id}/${anOpenSpace.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(generateTalkWithTrackBody(aMeetingLink, track, document = aDocument))
        ).andExpect(MockMvcResultMatchers.status().isOk).andReturn().response

        mockMvc.perform(
            MockMvcRequestBuilders.get("/openSpace/talks/${anOpenSpace.id}")
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].meetingLink").value(aMeetingLink))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].track.name").value(track.name))
            .andExpect(
                MockMvcResultMatchers.jsonPath("$[0].documents[0].name").value(aDocument.name)
            )
    }

    @Test
    fun `can create a valid marketplace talk and get it correctly`() {
        val user = userRepo.save(aUser())
        val anOpenSpace = openSpaceRepo.save(anyOpenSpaceWith(user))
        anOpenSpace.toggleCallForPapers(user)

        mockMvc.perform(
            MockMvcRequestBuilders.post("/openSpace/talk/${user.id}/${anOpenSpace.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(generateMarketplaceTalkWithTrackBody())
        ).andExpect(MockMvcResultMatchers.status().isOk).andReturn().response

        mockMvc.perform(
            MockMvcRequestBuilders.get("/openSpace/talks/${anOpenSpace.id}")
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].isMarketplaceTalk").value(true))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].speakerName").value("Alan Key"))
    }

    @Test
    fun `creating an invalid talk return an bad request status`() {
        val user = userRepo.save(aUser())
        val anOpenSpace = openSpaceRepo.save(anyOpenSpace())
        val anInvalidLink = "invalid link"

        mockMvc.perform(
            MockMvcRequestBuilders.post("/openSpace/talk/${user.id}/${anOpenSpace.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(generateTalkBody(aMeeting = anInvalidLink))
        )
            .andExpect(MockMvcResultMatchers.status().isBadRequest)
    }

    @Test
    fun `creating a talk when call for papers is closed return an unprocessable entity status`() {
        val user = userRepo.save(aUser())
        val anOpenSpace = openSpaceRepo.save(anyOpenSpace())
        val aMeetingLink = "https://aLink"

        mockMvc.perform(
            MockMvcRequestBuilders.post("/openSpace/talk/${user.id}/${anOpenSpace.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(generateTalkBody(aMeeting = aMeetingLink))
        )
            .andExpect(MockMvcResultMatchers.status().isUnprocessableEntity)
    }

    @Test
    fun `deleting a valid talk without jwt token return unauthorized status response`() {
        val organizer = userRepo.save(aUser(userEmail = "user@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(organizer)
        val aTalk = Talk("a talk", speaker = organizer)
        createTalkFor(organizer, anOpenSpace, aTalk)

        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/talk/${aTalk.id}/user/${organizer.id}")
        )
            .andExpect(MockMvcResultMatchers.status().isUnauthorized)
    }

    @Test
    fun `deleting a valid talk with user creator talk return an ok status response`() {
        val (organizer, bearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(organizer)
        val aTalk = Talk("a talk", speaker = organizer)
        createTalkFor(organizer, anOpenSpace, aTalk)

        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/talk/${aTalk.id}/user/${organizer.id}")
                .header(HttpHeaders.AUTHORIZATION, bearerToken)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)

        assertThatThereAreNoTalksInTheOpenSpace(anOpenSpace)
        assertThatTheUserHasNoTalks(organizer, anOpenSpace)
        assertThatTheBodyIsEmpty("/openSpace/assignedSlots/${anOpenSpace.id}")
    }

    @Test
    fun `deleting a valid talk with organizer openspace return an ok status response`() {
        val (user, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
        val (organizer, organizerBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "organizer@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(organizer)
        val aTalk = Talk("a talk", speaker = user)
        createTalkFor(organizer, anOpenSpace, aTalk)

        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/talk/${aTalk.id}/user/${organizer.id}")
                .header(HttpHeaders.AUTHORIZATION, organizerBearerToken)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)

        assertThatThereAreNoTalksInTheOpenSpace(anOpenSpace)
        assertThatTheUserHasNoTalks(user, anOpenSpace)
        assertThatTheBodyIsEmpty("/openSpace/assignedSlots/${anOpenSpace.id}")

    }

    @Test
    fun `deleting a valid talk with an invalid user return a forbidden response`() {
        val (user, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
        val (otherUser, otherUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "otherUser@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(user)
        val aTalk = Talk("a talk", speaker = user)
        createTalkFor(user, anOpenSpace, aTalk)

        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/talk/${aTalk.id}/user/${otherUser.id}")
                .header(HttpHeaders.AUTHORIZATION, otherUserBearerToken)
        )
            .andExpect(MockMvcResultMatchers.status().isForbidden)
    }

    @Test
    fun `deleting a valid talk with an valid user but not matching token user return a forbidden response`() {
        val (user, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
        val (_, otherUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "otherUser@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(user)
        val aTalk = Talk("a talk", speaker = user)
        createTalkFor(user, anOpenSpace, aTalk)

        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/talk/${aTalk.id}/user/${user.id}")
                .header(HttpHeaders.AUTHORIZATION, otherUserBearerToken)
        )
            .andExpect(MockMvcResultMatchers.status().isForbidden)
    }

    @Test
    fun `deleting an invalid talk return a not found response `() {
        val (user, userBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(user)

        mockMvc.perform(
            MockMvcRequestBuilders
                .delete("/openSpace/${anOpenSpace.id}/talk/${100}/user/${user.id}/")
                .header(HttpHeaders.AUTHORIZATION, userBearerToken)
        )
            .andExpect(MockMvcResultMatchers.status().isNotFound)
    }

    private fun createOpenSpaceFor(user: User): OpenSpace {
        val anOpenSpace = anOpenSpace()
        user.addOpenSpace(anOpenSpace)
        openSpaceRepo.save(anOpenSpace)
        return anOpenSpace
    }

    @Test
    fun `start a call for papers returns an ok status response and the modified Open Space`() {
        val user = userRepo.save(aUser())
        val anOpenSpace = openSpaceRepo.save(anyOpenSpaceWith(user))

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/${anOpenSpace.id}/user/${user.id}/callForPapers")
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(anOpenSpace.id))
            .andExpect(MockMvcResultMatchers.jsonPath("$.isActiveCallForPapers").value(true))
    }

    @Test
    fun `starting a call for papers with a non organizer user return a forbidden status`() {
        val organizer = userRepo.save(aUser(userEmail = "organizer@gmail.com"))
        val aUser = userRepo.save(aUser(userEmail = "user@gmail.com"))
        val anOpenSpace = openSpaceRepo.save(anyOpenSpaceWith(organizer))

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/${anOpenSpace.id}/user/${aUser.id}/callForPapers")
        ).andExpect(MockMvcResultMatchers.status().isForbidden)
    }

    @Test
    fun `update open space without jwt token return unauthorized status`() {
        val organizer = userRepo.save(aUser(userEmail = "organizer@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(organizer)

        val changedName = "a different name for the open space"
        val description = "W".repeat(1000)

        val openSpaceBody = anOpenSpaceCreationBody(
            description = description,
            name = changedName
        )

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/${anOpenSpace.id}/user/${organizer.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(openSpaceBody)
        ).andExpect(MockMvcResultMatchers.status().isUnauthorized)
    }

    @Test
    fun `update open space with invalid user jwt return forbidden`() {
        val (_, someUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
        val organizer = userRepo.save(aUser(userEmail = "organizer@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(organizer)

        val changedName = "a different name for the open space"
        val description = "W".repeat(1000)

        val openSpaceBody = anOpenSpaceCreationBody(
            description = description,
            name = changedName
        )

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/${anOpenSpace.id}/user/${organizer.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(openSpaceBody)
                .header(HttpHeaders.AUTHORIZATION, someUserBearerToken)
        ).andExpect(MockMvcResultMatchers.status().isForbidden)
    }

    @Test
    fun `can update an open space name`() {
        val (organizer, organizerBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "organizer@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(organizer)

        val changedName = "a different name for the open space"
        val description = "W".repeat(1000)

        val openSpaceBody = anOpenSpaceCreationBody(
            description = description,
            name = changedName
        )

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/${anOpenSpace.id}/user/${organizer.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(openSpaceBody)
                .header(HttpHeaders.AUTHORIZATION, organizerBearerToken)
        ).andExpect(MockMvcResultMatchers.status().isOk).andReturn().response

        val changedOpenSpace = openSpaceRepo.findById(anOpenSpace.id).get()
        assertEquals(changedName, changedOpenSpace.name)
    }

    @Test
    fun `can update open space collections`() {
        val (organizer, organizerBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "organizer@gmail.com"))
        val anOpenSpace = createOpenSpaceFor(organizer)

        val name = "a name"
        val description = "W".repeat(1000)
        val newTrack = Track(name = "new track", description = "W".repeat(500), color = "#FFFFFF")
        val newRoom = Room("new room", description = "")

        val openSpaceBody = anOpenSpaceCreationBody(
            description = description,
            name = name,
            room = newRoom,
            track = newTrack,
            talkSlotStartTime = intArrayOf(9, 0),
            talkSlotEndTime = intArrayOf(9, 30)
        )

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/${anOpenSpace.id}/user/${organizer.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(openSpaceBody)
                .header(HttpHeaders.AUTHORIZATION, organizerBearerToken)
        ).andExpect(MockMvcResultMatchers.status().isOk).andReturn().response

        val changedOpenSpace = openSpaceRepo.findById(anOpenSpace.id).get()
        assertTrue(changedOpenSpace.rooms.any { it.name == newRoom.name })
        assertTrue(changedOpenSpace.tracks.any { it.name == newTrack.name })
        assertTrue(changedOpenSpace.slots.any { it.startTime == LocalTime.parse("09:00") })
    }

    @Test
    fun `updating an invalid open space throws a not found response`() {
        val (someUser, someUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "someUser@gmail.com"))

        val changedName = "a different name for the open space"
        val description = "W".repeat(1000)

        val openSpaceBody = anOpenSpaceCreationBody(
            description = description,
            name = changedName
        )

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/979797997/user/${someUser.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(openSpaceBody)
                .header(HttpHeaders.AUTHORIZATION, someUserBearerToken)
        ).andExpect(MockMvcResultMatchers.status().isNotFound)
    }

    @Test
    fun `updating with not exist user and their token throws a unauthorized response`() {
        val (someUser, someUserBearerToken, someUserAuthSession) = registerAndGetAuthSession(aUser(userEmail = "someUser@gmail.com"))
        val (organizer, _) = registerAndGenerateAuthToken(aUser(userEmail = "organizer@gmail.com"))
        userRepo.delete(someUser)
        authSessionRepo.deleteById(someUserAuthSession.id)
        val anOpenSpace = createOpenSpaceFor(organizer)

        val changedName = "a different name for the open space"
        val description = "W".repeat(1000)

        val openSpaceBody = anOpenSpaceCreationBody(
            description = description,
            name = changedName
        )

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/${anOpenSpace.id}/user/${someUser.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(openSpaceBody)
                .header(HttpHeaders.AUTHORIZATION, someUserBearerToken)
        ).andExpect(MockMvcResultMatchers.status().isUnauthorized)
    }

    @Test
    fun `start voting returns an ok status response and the modified Open Space`() {
        val user = userRepo.save(aUser())
        val anOpenSpace = openSpaceRepo.save(anyOpenSpaceWith(user))

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/${anOpenSpace.id}/user/${user.id}/voting")
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(anOpenSpace.id))
            .andExpect(MockMvcResultMatchers.jsonPath("$.isActiveVoting").value(true))
    }

    @Test
    fun `toggle show speaker name returns an ok status response and the modified Open Space`() {
        val user = userRepo.save(aUser())
        val anOpenSpace = openSpaceRepo.save(anyOpenSpaceWith(user))

        mockMvc.perform(
            MockMvcRequestBuilders.put("/openSpace/${anOpenSpace.id}/user/${user.id}/showSpeakerName")
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(anOpenSpace.id))
            .andExpect(MockMvcResultMatchers.jsonPath("$.showSpeakerName").value(false))
    }

    private fun registerAndGenerateAuthToken(userToRegister: User): Pair<User, String> {
        val token = authService.register(userToRegister).token
        val user = userRepo.findByEmail(userToRegister.email)
            ?: throw IllegalStateException("User not created")
        return user to "$TOKEN_PREFIX$token"
    }

    private fun registerAndGetAuthSession(userToRegister: User): Triple<User, String, AuthSession> {
        val authSession = authService.register(userToRegister)
        val user = userRepo.findByEmail(userToRegister.email)
            ?: throw IllegalStateException("User not created")
        return Triple(user, "$TOKEN_PREFIX${authSession.token}", authSession)
    }

    private fun anyOpenSpaceWith(organizer: User, tracks: Set<Track>? = null): OpenSpace {
        val openSpace: OpenSpace = if (tracks == null) {
            anOpenSpace()
        } else {
            anOpenSpace(tracks = tracks)
        }
        organizer.addOpenSpace(openSpace)
        return openSpace
    }

    private fun anyOpenSpace(): OpenSpace {
        return OpenSpace(
            "os", mutableSetOf(Room("1")), mutableSetOf(
                TalkSlot(
                    LocalTime.parse("09:00"),
                    LocalTime.parse("09:30"),
                    LocalDate.parse("2007-12-03")
                )
            )
        )
    }

    private fun assertThatTheUserHasNoOpenSpaces(user: User) {
        val path = "/openSpace/user/${user.id}"
        assertThatTheBodyIsEmpty(path)
    }

    private fun createTalkFor(organizer: User, anOpenSpace: OpenSpace, aTalk: Talk) {
        anOpenSpace.toggleCallForPapers(organizer)
        anOpenSpace.addTalk(aTalk)
        talkRepo.save(aTalk)
    }

    private fun assertThatTheUserHasNoTalks(user: User, anOpenSpace: OpenSpace) {
        val path = "/openSpace/talks/${user.id}/${anOpenSpace.id}"
        assertThatTheBodyIsEmpty(path)
    }

    private fun assertThatThereAreNoTalksInTheOpenSpace(anOpenSpace: OpenSpace) {
        val path = "/openSpace/talks/${anOpenSpace.id}"
        assertThatTheBodyIsEmpty(path)
    }

    private fun assertThatTheBodyIsEmpty(path: String) {
        mockMvc.perform(
            MockMvcRequestBuilders.get(path)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$").isEmpty)
    }

    private fun anOpenSpaceCreationBody(
        description: String,
        name: String = "asd",
        track: Track = Track(name = "a track", color = "#FFFFFF"),
        room: Room = Room(name = "a room", description = ""),
        talkSlotStartTime: IntArray = intArrayOf(0, 0),
        talkSlotEndTime: IntArray = intArrayOf(0, 15)
    ): String {
        return """
{
    "dates": ["2022-05-11T03:00:00.000Z"],
    "name": "$name",
    "description": "$description",
    "rooms": [{"name": "${room.name}"}],
    "slots": [
        {
            "date": [2022, 5, 11],
            "type": "TalkSlot",
            "endTime": [
                ${talkSlotEndTime[0]},
                ${talkSlotEndTime[1]}
            ],
            "startTime": [
                ${talkSlotStartTime[0]},
                ${talkSlotStartTime[1]}
            ]
        }
    ],
    "tracks": [
        {
            "name": "${track.name}",
            "color": "${track.color}",
            "description": "${track.description}"
        }
    ]
}
        """.trimIndent()
    }

    private fun generateTalkWithTrackBody(
        aMeeting: String,
        track: Track,
        document: Document
    ): String {
        return """
            {
                "name": "a talk",
                "meetingLink": "$aMeeting",
                "trackId": ${track.id},
                "documents": [{"name": "${document.name}", "link": "${document.link}"}] 
            }
        """.trimIndent()
    }

    private fun generateMarketplaceTalkWithTrackBody(): String {
        return """
            {
                "name": "a talk",
                "speakerName": "Alan Key" 
            }
        """.trimIndent()
    }

    private fun generateTalkBody(aMeeting: String): String {
        return """
            {
                "name": "a talk",
                "meetingLink": "$aMeeting"
            }
        """.trimIndent()
    }

}
