package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.aspect.LoggingExecution
import com.sos.smartopenspace.aspect.LoggingInputExecution
import com.sos.smartopenspace.dto.request.CreateTalkRequestDTO
import com.sos.smartopenspace.dto.request.OpenSpaceRequestDTO
import com.sos.smartopenspace.services.AuthServiceI
import com.sos.smartopenspace.services.OpenSpaceService
import com.sos.smartopenspace.translators.OpenSpaceTranslator
import com.sos.smartopenspace.translators.TalkTranslator
import io.github.resilience4j.ratelimiter.annotation.RateLimiter
import jakarta.validation.Valid
import jakarta.ws.rs.core.HttpHeaders
import org.springframework.web.bind.annotation.*


@RateLimiter(name = "default")
@RestController
@RequestMapping("openSpace")
class OpenSpaceController(
    private val openSpaceService: OpenSpaceService,
    private val authService: AuthServiceI
) {
    @PostMapping("/{userID}")
    @LoggingExecution
    fun create(@PathVariable userID: Long, @Valid @RequestBody openSpace: OpenSpaceRequestDTO) =
        OpenSpaceTranslator.translateFrom(openSpaceService.create(userID, openSpace))

    @PutMapping("/{openSpaceID}/user/{userID}")
    @LoggingInputExecution
    fun updateOpenSpace(
        @RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String,
        @PathVariable openSpaceID: Long,
        @PathVariable userID: Long,
        @Valid @RequestBody openSpace: OpenSpaceRequestDTO
    ) = authService.validateTokenBelongsToUserId(authToken, userID).let {
        OpenSpaceTranslator.translateFrom(openSpaceService.update(userID, openSpaceID, openSpace))
    }

    @DeleteMapping("/{openSpaceID}/user/{userID}")
    @LoggingExecution
    fun delete(
        @RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String,
        @PathVariable userID: Long,
        @PathVariable openSpaceID: Long
    ) = authService.validateTokenBelongsToUserId(authToken, userID).let {
        openSpaceService.delete(userID, openSpaceID)
    }


    @PostMapping("/talk/{userID}/{osID}")
    @LoggingExecution
    fun createTalk(
        @PathVariable userID: Long,
        @PathVariable osID: Long,
        @Valid @RequestBody createTalkRequestDTO: CreateTalkRequestDTO
    ) =
        TalkTranslator.translateFrom(
            openSpaceService.createTalk(userID, osID, createTalkRequestDTO)
        )

    @DeleteMapping("/{openSpaceID}/talk/{talkID}/user/{userID}")
    @LoggingExecution
    fun deleteTalk(
        @RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String,
        @PathVariable userID: Long,
        @PathVariable openSpaceID: Long,
        @PathVariable talkID: Long
    ) = authService.validateTokenBelongsToUserId(authToken, userID).let {
        TalkTranslator.translateFrom(openSpaceService.deleteTalk(talkID, openSpaceID, userID))
    }

    @GetMapping("/user/{userID}")
    @LoggingInputExecution
    fun findAllByUser(@PathVariable userID: Long) =
        openSpaceService.findAllByUser(userID).map { OpenSpaceTranslator.translateFrom(it) }

    @GetMapping("/{id}")
    @LoggingInputExecution
    fun findById(@PathVariable id: Long) =
        OpenSpaceTranslator.translateFrom(openSpaceService.findById(id))

    @GetMapping("/talks/{userID}/{osID}")
    @LoggingInputExecution
    fun findTalksByUser(@PathVariable userID: Long, @PathVariable osID: Long) =
        openSpaceService.findTalksOfUserInOpenSpace(userID, osID)
            .map { TalkTranslator.translateFrom(it) }

    @GetMapping("/talks/{id}")
    @LoggingInputExecution
    fun findTalks(@PathVariable id: Long) =
        openSpaceService.findTalks(id).map { TalkTranslator.translateFrom(it) }

    @GetMapping("/assignedSlots/{id}")
    @LoggingInputExecution
    fun findAssignedSlotsById(@PathVariable id: Long) = openSpaceService.findAssignedSlotsById(id)

    @PutMapping("/activateQueue/{userID}/{osID}")
    @LoggingInputExecution
    fun activateQueue(@PathVariable userID: Long, @PathVariable osID: Long) =
        OpenSpaceTranslator.translateFrom(openSpaceService.activateQueue(userID, osID))

    @PutMapping("/finishQueue/{userID}/{osID}")
    @LoggingInputExecution
    fun finishQueue(@PathVariable userID: Long, @PathVariable osID: Long) =
        OpenSpaceTranslator.translateFrom(openSpaceService.finishQueue(userID, osID))

    @PutMapping("/enqueueTalk/{userID}/{talkID}")
    @LoggingInputExecution
    fun enqueueTalk(@PathVariable userID: Long, @PathVariable talkID: Long) =
        OpenSpaceTranslator.translateFrom(openSpaceService.enqueueTalk(userID, talkID))

    @PutMapping("/{openSpaceId}/user/{userID}/callForPapers")
    @LoggingInputExecution
    fun callForPapers(@PathVariable userID: Long, @PathVariable openSpaceId: Long) =
        OpenSpaceTranslator.translateFrom(openSpaceService.toggleCallForPapers(openSpaceId, userID))

    @PutMapping("/{openSpaceId}/user/{userID}/voting")
    @LoggingInputExecution
    fun voting(@PathVariable userID: Long, @PathVariable openSpaceId: Long) =
        OpenSpaceTranslator.translateFrom(openSpaceService.toggleVoting(openSpaceId, userID))

    @PutMapping("/{openSpaceId}/user/{userID}/showSpeakerName")
    @LoggingInputExecution
    fun showSpeaker(@PathVariable userID: Long, @PathVariable openSpaceId: Long) =
        OpenSpaceTranslator.translateFrom(
            openSpaceService.toggleShowSpeakerName(
                openSpaceId,
                userID
            )
        )

}
