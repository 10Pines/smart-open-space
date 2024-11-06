package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.aspect.LoggingInputExecution
import com.sos.smartopenspace.dto.request.CreateReviewRequestDTO
import com.sos.smartopenspace.dto.request.CreateTalkRequestDTO
import com.sos.smartopenspace.services.TalkService
import com.sos.smartopenspace.translators.response.OpenSpaceResTranslator
import com.sos.smartopenspace.translators.response.TalkResTranslator
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("talk")
class TalkController(private val talkService: TalkService) {

  @PutMapping("/schedule/{userID}/{talkID}/{slotID}/{roomID}")
  @LoggingInputExecution
  fun scheduleTalk(
    @PathVariable userID: Long,
    @PathVariable talkID: Long,
    @PathVariable slotID: Long,
    @PathVariable roomID: Long
  ) =
    OpenSpaceResTranslator.translateFrom(talkService.scheduleTalk(talkID, userID, slotID, roomID))

  @PutMapping("/exchange/{talkID}/{slotID}/{roomID}")
  @LoggingInputExecution
  fun exchangeTalk(
    @PathVariable talkID: Long,
    @PathVariable slotID: Long,
    @PathVariable roomID: Long
  ) =
    OpenSpaceResTranslator.translateFrom(talkService.exchangeTalk(talkID, roomID, slotID))

  @PutMapping("/nextTalk/{userID}/{osID}")
  @LoggingInputExecution
  fun nextTalk(@PathVariable userID: Long, @PathVariable osID: Long) =
    OpenSpaceResTranslator.translateFrom(talkService.nextTalk(userID, osID))

  @GetMapping("/{talkID}")
  @LoggingInputExecution
  fun getTalk(@PathVariable talkID: Long) = TalkResTranslator.translateFrom(talkService.getTalk(talkID))

  @PutMapping("/{talkId}/user/{userId}")
  @LoggingInputExecution
  fun updateTalk(@PathVariable talkId: Long, @PathVariable userId: Long, @Valid @RequestBody createTalkRequestDTO: CreateTalkRequestDTO) =
    TalkResTranslator.translateFrom(talkService.updateTalk(talkId, userId, createTalkRequestDTO))
    
  @PutMapping("/{talkID}/user/{userID}/vote")
  @LoggingInputExecution
  fun voteTalk( @PathVariable talkID: Long, @PathVariable userID: Long) =
    TalkResTranslator.translateFrom(talkService.voteTalk(talkID, userID))

  @PutMapping("/{talkID}/user/{userID}/unvote")
  @LoggingInputExecution
  fun unvoteTalk( @PathVariable talkID: Long, @PathVariable userID: Long) =
    TalkResTranslator.translateFrom(talkService.unvoteTalk(talkID, userID))

  @PostMapping("/{talkID}/user/{userID}/review")
  @LoggingInputExecution
  fun reviewTalk( @PathVariable talkID: Long, @PathVariable userID: Long, @Valid @RequestBody createReviewRequestDTO: CreateReviewRequestDTO) =
    TalkResTranslator.translateFrom(talkService.addReview(talkID, userID, createReviewRequestDTO))
}
