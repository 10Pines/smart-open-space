package com.sos.smartopenspace.controllers

import com.jayway.jsonpath.JsonPath
import com.sos.smartopenspace.aUser
import com.sos.smartopenspace.anOpenSpace
import com.sos.smartopenspace.anOpenSpaceWith
import com.sos.smartopenspace.domain.*
import com.sos.smartopenspace.generateTalkBody
import com.sos.smartopenspace.persistence.*
import com.sos.smartopenspace.services.impl.AuthService
import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import jakarta.ws.rs.core.HttpHeaders
import jakarta.ws.rs.core.MediaType
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalTime

@Transactional
class TalkControllerTest: BaseControllerTest() {

  @Test
  fun `schedule a talk returns an ok status response`() {
    val organizer = anySavedUser("user@gmail.com")
    val talk = anySavedTalk(organizer)
    val room = anySavedRoom()
    val aSlot = aSavedSlot()
    val openSpace = openSpaceRepository.save(anOpenSpaceWith(talk, organizer, setOf(aSlot), setOf(room)))

    mockMvc.perform(
      put("/talk/schedule/${organizer.id}/${talk.id}/${aSlot.id}/${room.id}")
    ).andExpect(MockMvcResultMatchers.status().isOk)

    assertTrue(openSpace.freeSlots().isEmpty())
  }

  @Test
  fun `when a talk cannot be scheduled it should return a bad request response`() {
    val organizer = anySavedUser("user@gmail.com")
    val talk = anySavedTalk(organizer)
    val speaker = aSavedUserWithTalk(talk)
    val openSpace = openSpaceRepository.save(anOpenSpaceWith(talk, organizer))
    val slot = openSpace.slots.first()
    val room = anySavedRoom()

    mockMvc.perform(
      put("/talk/schedule/${speaker.id}/${talk.id}/${slot.id}/${room.id}")
    ).andExpect(MockMvcResultMatchers.status().isBadRequest)
  }

  @Test
  fun `exchange a talk returns an ok status response`() {
    val organizer = anySavedUser("user@gmail.com")
    val talk = anySavedTalk(organizer)
    val room = anySavedRoom()
    val aSlot = aSavedSlot()
    val otherSlot = otherSavedSlot()
    val openSpace = openSpaceRepository.save(anOpenSpaceWith(talk, organizer, setOf(aSlot, otherSlot), setOf(room)))
    openSpace.scheduleTalk(talk, organizer, aSlot as TalkSlot, room)

    mockMvc.perform(
            put("/talk/exchange/${talk.id}/${otherSlot.id}/${room.id}")
    ).andExpect(MockMvcResultMatchers.status().isOk)

    assertEquals(1, freeSlots(openSpace).size)
    assertTrue( freeSlots(openSpace).contains(aSlot))
  }

  @Test
  fun `Asking for an specific talk returns an ok status`() {
    val organizer = anySavedUser("user@gmail.com")
    val talk = anySavedTalk(organizer)
    val openSpace = anySavedOpenSpace()
    organizer.addOpenSpace(openSpace)
    aSavedUserWithTalk(talk)

    mockMvc.perform(
      get("/talk/${talk.id}")
    ).andExpect(MockMvcResultMatchers.status().isOk)
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(talk.id))
      .andExpect(MockMvcResultMatchers.jsonPath("$.name").value(talk.name))
  }

  @Test
  fun `Asking for a talk that not exist returns a not found`() {
    mockMvc.perform(
      get("/talk/77777")
    ).andExpect(MockMvcResultMatchers.status().isNotFound)
  }


  @Test
  fun `can update a talk correctly`() {
    val (user, userBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val anOpenSpace = anOpenSpace()
    user.addOpenSpace(anOpenSpace)
    anOpenSpace.toggleCallForPapers(user)
    openSpaceRepository.save(anOpenSpace)

    val aTalk = Talk("a talk", speaker = user)
    anOpenSpace.addTalk(aTalk)
    talkRepository.save(aTalk)

    val changedDescription = "a different description"
    val entityResponse = mockMvc.perform(
      put("/talk/${aTalk.id}/user/${user.id}")
        .contentType(MediaType.APPLICATION_JSON)
        .content(generateTalkBody(description = changedDescription))
        .header(HttpHeaders.AUTHORIZATION, userBearerToken)
    ).andExpect(MockMvcResultMatchers.status().isOk).andReturn().response

    val talkId = JsonPath.read<Int>(entityResponse.contentAsString, "$.id")

    mockMvc.perform(
      get("/openSpace/talks/${anOpenSpace.id}")
    )
      .andExpect(MockMvcResultMatchers.status().isOk)
      .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(talkId))
      .andExpect(MockMvcResultMatchers.jsonPath("$[0].description").value(changedDescription))
  }

  @Test
  fun `updating an nonexistent talk returns a not found status`() {
    val (user, userBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val anOpenSpace = anOpenSpace()
    user.addOpenSpace(anOpenSpace)
    anOpenSpace.toggleCallForPapers(user)
    openSpaceRepository.save(anOpenSpace)
    val nonexistentTalkId = 789

    mockMvc.perform(
        put("/talk/${nonexistentTalkId}/user/${user.id}")
        .contentType(MediaType.APPLICATION_JSON)
        .content(generateTalkBody())
        .header(HttpHeaders.AUTHORIZATION, userBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isNotFound)
  }

  @Test
  fun `updating an talk without jwt token returns a unauthorized status`() {
    val (user, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val anOpenSpace = anOpenSpace()
    user.addOpenSpace(anOpenSpace)
    anOpenSpace.toggleCallForPapers(user)
    openSpaceRepository.save(anOpenSpace)
    val talkId = 789

    mockMvc.perform(
      put("/talk/${talkId}/user/${user.id}")
        .contentType(MediaType.APPLICATION_JSON)
        .content(generateTalkBody())
    )
      .andExpect(MockMvcResultMatchers.status().isUnauthorized)
  }

  @Test
  fun `updating an talk with userID param which not match userID from jwt token returns a forbidden status`() {
    val (user, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val (_, otherUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "otherUser@gmail.com"))
    val anOpenSpace = anOpenSpace()
    user.addOpenSpace(anOpenSpace)
    anOpenSpace.toggleCallForPapers(user)
    openSpaceRepository.save(anOpenSpace)
    val talkId = 789

    mockMvc.perform(
      put("/talk/${talkId}/user/${user.id}")
        .contentType(MediaType.APPLICATION_JSON)
        .content(generateTalkBody())
        .header(HttpHeaders.AUTHORIZATION, otherUserBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isForbidden)
  }

  @Test
  fun `a talk voted by a user (not talk owner) returns an ok status response and increase talk votes`() {
    val (aUser, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val (userTalkOwner, _) = registerAndGenerateAuthToken(aUser(userEmail = "otherUser@gmail.com"))
    val talk = anySavedTalk(userTalkOwner)

    mockMvc.perform(
      put("/talk/${talk.id}/user/${aUser.id}/vote")
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isOk)
      .andExpect(MockMvcResultMatchers.jsonPath("$.votes").value(1))
  }

  @Test
  fun `a talk voted by their owner user returns bad request status response`() {
    val (userTalkOwner, userTalkOwnerBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "otherUser@gmail.com"))
    val talk = anySavedTalk(userTalkOwner)

    mockMvc.perform(
      put("/talk/${talk.id}/user/${userTalkOwner.id}/vote")
        .header(HttpHeaders.AUTHORIZATION, userTalkOwnerBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isBadRequest)
  }

  @Test
  fun `GIVEN a talk which already has a user voted WHEN vote talk by same user THEN returns an ok status response and not increase talk votes`() {
    val (aUser, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val (userTalkOwner, _) = registerAndGenerateAuthToken(aUser(userEmail = "otherUser@gmail.com"))
    val talk = anySavedTalkWithUserVote(userTalkOwner, aUser)
    assertTrue(talk.votingUsers.contains(aUser))
    mockMvc.perform(
      put("/talk/${talk.id}/user/${aUser.id}/vote")
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isOk)
      .andExpect(MockMvcResultMatchers.jsonPath("$.votes").value(1))
  }

  @Test
  fun `vote talk without jwt token should return unauthorized status response`() {
    val (userTalkOwner, _) = registerAndGenerateAuthToken(aUser(userEmail = "otherUser@gmail.com"))
    val talk = anySavedTalk(userTalkOwner)

    mockMvc.perform(
      put("/talk/${talk.id}/user/${userTalkOwner.id}/vote")
    )
      .andExpect(MockMvcResultMatchers.status().isUnauthorized)
  }

  @Test
  fun `vote talk with not match userID param and token userID return forbidden response`() {
    val (aUser, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val (userTalkOwner, userTalkOwnerBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "otherUser@gmail.com"))
    val talk = anySavedTalkWithUserVote(userTalkOwner, aUser)
    assertTrue(talk.votingUsers.contains(aUser))
    mockMvc.perform(
      put("/talk/${talk.id}/user/${aUser.id}/vote")
        .header(HttpHeaders.AUTHORIZATION, userTalkOwnerBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isForbidden)
  }

  @Test
  fun `a talk unvoted by a user returns an ok status response and decrease talk votes`() {
    val (aUser, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val talk = anySavedTalk(aUser)
    talk.addVoteBy(aUser)
    talkRepository.save(talk)

    mockMvc.perform(
      put("/talk/${talk.id}/user/${aUser.id}/unvote")
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isOk)
      .andExpect(MockMvcResultMatchers.jsonPath("$.votes").value(0))
  }

  @Test
  fun `a talk cannot be unvoted by a user that did not vote it returns a bad request`() {
    val (aUser, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val talk = anySavedTalk(aUser)
    talkRepository.save(talk)

    mockMvc.perform(
      put("/talk/${talk.id}/user/${aUser.id}/unvote")
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)

    )
      .andExpect(MockMvcResultMatchers.status().isBadRequest)
  }

  @Test
  fun `a talk cannot be unvoted by a another user jwt using other user_id which contains vote Returns a forbidden`() {
    val (aUser, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val (_, otherUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "other_user@gmail.com"))
    val talk = anySavedTalk(aUser)
    talkRepository.save(talk)

    mockMvc.perform(
      put("/talk/${talk.id}/user/${aUser.id}/unvote")
        .header(HttpHeaders.AUTHORIZATION, otherUserBearerToken)

    )
      .andExpect(MockMvcResultMatchers.status().isForbidden)
  }

  @Test
  fun `a talk cannot be unvoted without jwt token returns a unauthorized`() {
    val (aUser, _) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val talk = anySavedTalk(aUser)
    talkRepository.save(talk)

    mockMvc.perform(
      put("/talk/${talk.id}/user/${aUser.id}/unvote")
    )
      .andExpect(MockMvcResultMatchers.status().isUnauthorized)
  }

  @Test
  fun `review talk adds review to talk reviews`() {
    val (aUser, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val talk = anySavedTalk(aUser)
    val content = aReviewCreationBody(5, "a review")

    mockMvc.perform(
      post("/talk/${talk.id}/user/${aUser.id}/review")
        .contentType(MediaType.APPLICATION_JSON)
        .content(content)
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isOk)
      .andExpect(MockMvcResultMatchers.jsonPath("$.reviews[0].grade").value(5))
  }

  @Test
  fun `cannot add another review talk if exist another review into talk reviews on same open space`() {
    val (aUser, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = "user@gmail.com"))
    val someReview = Review(3, aUser, "first review")
    val talk = anySavedTalkWithUserReview(aUser, someReview)
    val content = aReviewCreationBody(2, "second review")

    mockMvc.perform(
      post("/talk/${talk.id}/user/${aUser.id}/review")
        .contentType(MediaType.APPLICATION_JSON)
        .content(content)
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isBadRequest)
  }

  @Test
  fun `add review with a grade greater than 5 throws Bad Request`() {
    val (aUser, aUserBearerToken) = registerAndGenerateAuthToken(aUser())
    val talk = anySavedTalk(aUser)
    val content = aReviewCreationBody(6, "a review")

    mockMvc.perform(
      post("/talk/${talk.id}/user/${aUser.id}/review")
        .contentType(MediaType.APPLICATION_JSON)
        .content(content)
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isBadRequest)
  }

  @Test
  fun `add review with a grade lower than 1 throws Bad Request`() {
    val (aUser, aUserBearerToken) = registerAndGenerateAuthToken(aUser())
    val talk = anySavedTalk(aUser)
    val content = aReviewCreationBody(0, "a review")

    mockMvc.perform(
      post("/talk/${talk.id}/user/${aUser.id}/review")
        .contentType(MediaType.APPLICATION_JSON)
        .content(content)
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isBadRequest)
  }

  @Test
  fun `add review with reviewer userID and jwt token with userID does not match Return Forbidden status`() {
    val (aUser, aUserBearerToken) = registerAndGenerateAuthToken(aUser())
    val talk = anySavedTalk(aUser)
    val content = aReviewCreationBody(4, "a review")

    val someOtherUserId = aUser.id+10
    mockMvc.perform(
      post("/talk/${talk.id}/user/$someOtherUserId/review")
        .contentType(MediaType.APPLICATION_JSON)
        .content(content)
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )
      .andExpect(MockMvcResultMatchers.status().isForbidden)
  }

  @Test
  fun `add review without jwt token Return unauthorized status`() {
    val (aUser, _) = registerAndGenerateAuthToken(aUser())
    val talk = anySavedTalk(aUser)
    val content = aReviewCreationBody(4, "a review")

    mockMvc.perform(
      post("/talk/${talk.id}/user/${aUser.id}/review")
        .contentType(MediaType.APPLICATION_JSON)
        .content(content)
    )
      .andExpect(MockMvcResultMatchers.status().isUnauthorized)
  }

  private fun registerAndGenerateAuthToken(userToRegister: User): Pair<User, String> {
    val token = authService.register(userToRegister).token
    val user = userRepo.findByEmail(userToRegister.email)
      ?: throw IllegalStateException("User not created")
    return user to "$TOKEN_PREFIX$token"
  }

  private fun anySavedRoom() = roomRepository.save(Room("Sala"))

  private fun anySavedTalk(organizer: User) = talkRepository.save(Talk("Charla", speaker = organizer))

  private fun anySavedTalkWithUserVote(talkOwner: User, userToVote: User): Talk {
    val talk = anySavedTalk(talkOwner)
    talk.addVoteBy(userToVote)
    return talkRepository.save(talk)
  }

  private fun anySavedTalkWithUserReview(user: User, review: Review): Talk {
    val talk = anySavedTalk(user)
    talk.addReview(review)
    return talkRepository.save(talk)
  }

  private fun anySavedUser(userEmail: String) = userRepo.save(aUser(userEmail = userEmail))

  private fun anySavedOpenSpace() = openSpaceRepository.save(anOpenSpace())

  private fun aSavedUserWithTalk(talk: Talk) =
    userRepo.save(aUser(mutableSetOf(), mutableSetOf(talk), "Pepe@sos.sos"))

  private fun aSavedSlot(): Slot {
    return slotRepository.save(TalkSlot(LocalTime.parse("09:00"), LocalTime.parse("09:30"), LocalDate.now()))
  }

  private fun otherSavedSlot(): Slot {
    return slotRepository.save(TalkSlot(LocalTime.parse("09:30"), LocalTime.parse("10:00"), LocalDate.now().plusDays(1)))
  }

  private fun freeSlots(openSpace: OpenSpace) = openSpace.freeSlots().first().second

  private fun aReviewCreationBody(grade: Int, comment: String): String {
    return """
      {
          "grade": "$grade",
          "comment": "$comment"
      }
      """
  }
}