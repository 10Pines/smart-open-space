package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.aspect.LoggingInputExecution
import com.sos.smartopenspace.domain.UserNotBelongToAuthToken
import com.sos.smartopenspace.dto.request.CreateReviewRequestDTO
import com.sos.smartopenspace.dto.request.CreateTalkRequestDTO
import com.sos.smartopenspace.services.AuthServiceI
import com.sos.smartopenspace.services.TalkService
import com.sos.smartopenspace.translators.OpenSpaceTranslator
import com.sos.smartopenspace.translators.TalkTranslator
import jakarta.validation.Valid
import jakarta.ws.rs.core.HttpHeaders
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("talk")
class TalkController(
    private val talkService: TalkService,
    private val authService: AuthServiceI
) {

    @PutMapping("/schedule/{userID}/{talkID}/{slotID}/{roomID}")
    @LoggingInputExecution
    fun scheduleTalk(
        @PathVariable userID: Long,
        @PathVariable talkID: Long,
        @PathVariable slotID: Long,
        @PathVariable roomID: Long
    ) =
        OpenSpaceTranslator.translateFrom(talkService.scheduleTalk(talkID, userID, slotID, roomID))

    @PutMapping("/exchange/{talkID}/{slotID}/{roomID}")
    @LoggingInputExecution
    fun exchangeTalk(
        @PathVariable talkID: Long,
        @PathVariable slotID: Long,
        @PathVariable roomID: Long
    ) =
        OpenSpaceTranslator.translateFrom(talkService.exchangeTalk(talkID, roomID, slotID))

    @PutMapping("/nextTalk/{userID}/{osID}")
    @LoggingInputExecution
    fun nextTalk(@PathVariable userID: Long, @PathVariable osID: Long) =
        OpenSpaceTranslator.translateFrom(talkService.nextTalk(userID, osID))

    @GetMapping("/{talkID}")
    @LoggingInputExecution
    fun getTalk(@PathVariable talkID: Long) =
        TalkTranslator.translateFrom(talkService.getTalk(talkID))

    @PutMapping("/{talkId}/user/{userId}")
    @LoggingInputExecution
    fun updateTalk(
        @RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String,
        @PathVariable talkId: Long,
        @PathVariable userId: Long,
        @Valid @RequestBody createTalkRequestDTO: CreateTalkRequestDTO
    ) = validateTokenWithUserIDParam(authToken, userId).let {
        TalkTranslator.translateFrom(talkService.updateTalk(talkId, userId, createTalkRequestDTO))
    }

    @PutMapping("/{talkID}/user/{userID}/vote")
    @LoggingInputExecution
    fun voteTalk(
        @RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String,
        @PathVariable talkID: Long,
        @PathVariable userID: Long
    ) = validateTokenWithUserIDParam(authToken, userID).let {
        TalkTranslator.translateFrom(talkService.voteTalk(talkID, userID))
    }

    @PutMapping("/{talkID}/user/{userID}/unvote")
    @LoggingInputExecution
    fun unvoteTalk(
        @RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String,
        @PathVariable talkID: Long,
        @PathVariable userID: Long
    ) = validateTokenWithUserIDParam(authToken, userID).let {
        TalkTranslator.translateFrom(talkService.unvoteTalk(talkID, userID))
    }

    @PostMapping("/{talkID}/user/{userID}/review")
    @LoggingInputExecution
    fun reviewTalk(
        @RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String,
        @PathVariable talkID: Long,
        @PathVariable userID: Long,
        @Valid @RequestBody createReviewRequestDTO: CreateReviewRequestDTO
    ) = validateTokenWithUserIDParam(authToken, userID).let {
        TalkTranslator.translateFrom(talkService.addReview(talkID, userID, createReviewRequestDTO))
    }

    private fun validateTokenWithUserIDParam(authToken: String, userID: Long) {
        if (!authService.tokenBelongsToUser(authToken, userID)) {
            throw UserNotBelongToAuthToken()
        }
    }
}
