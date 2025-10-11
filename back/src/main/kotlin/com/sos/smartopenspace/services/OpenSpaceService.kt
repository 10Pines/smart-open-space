package com.sos.smartopenspace.services

import com.sos.smartopenspace.domain.OpenSpace
import com.sos.smartopenspace.domain.OpenSpaceNotFoundException
import com.sos.smartopenspace.domain.Talk
import com.sos.smartopenspace.domain.TalkNotFoundException
import com.sos.smartopenspace.domain.Track
import com.sos.smartopenspace.domain.TrackNotFoundException
import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.domain.UserNotOwnerOfOpenSpaceException
import com.sos.smartopenspace.dto.request.CreateTalkRequestDTO
import com.sos.smartopenspace.dto.request.OpenSpaceRequestDTO
import com.sos.smartopenspace.dto.response.AssignedSlotResponseDTO
import com.sos.smartopenspace.persistence.OpenSpaceRepository
import com.sos.smartopenspace.persistence.TalkRepository
import com.sos.smartopenspace.persistence.TrackRepository
import com.sos.smartopenspace.translators.AssignedSlotTranslator
import com.sos.smartopenspace.util.SCHEDULE_CACHE_NAME
import com.sos.smartopenspace.websockets.QueueSocket
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class OpenSpaceService(
  private val openSpaceRepository: OpenSpaceRepository,
  private val talkRepository: TalkRepository,
  private val trackRepository: TrackRepository,
  private val userService: UserService,
  private val queueSocket: QueueSocket,
  private val updatableItemCollectionService: UpdatableItemCollectionService
) {
  private fun findUser(userID: Long) = userService.findById(userID)

  fun create(
    userID: Long,
    openSpaceRequestDTO: OpenSpaceRequestDTO
  ): OpenSpace {
    val openSpace = OpenSpace(
      name = openSpaceRequestDTO.name,
      rooms = openSpaceRequestDTO.rooms.toMutableSet(),
      slots = openSpaceRequestDTO.slots.toMutableSet(),
      description = openSpaceRequestDTO.description,
      tracks = openSpaceRequestDTO.tracks.toMutableSet()
    )
    findUser(userID).addOpenSpace(openSpace)
    return openSpaceRepository.save(openSpace)
  }

  fun update(
    userID: Long,
    openSpaceID: Long,
    openSpaceRequestDTO: OpenSpaceRequestDTO
  ): OpenSpace {
    val openSpace = findById(openSpaceID)
    val user = findUser(userID)
    checkOwnershipOpenSpace(user, openSpace)
    val deletedTracks = updatableItemCollectionService.getDeletedItems(
      openSpaceRequestDTO.tracks,
      openSpace.tracks
    )
    val talksWithoutTrack =
      talkRepository.findByOpenSpaceIdAndTrackIds(
        openSpaceID,
        deletedTracks.map { it.id })
        ?: emptyList()

    openSpace.updateRooms(
      updatableItemCollectionService.getNewItems(openSpaceRequestDTO.rooms),
      updatableItemCollectionService.getDeletedItems(
        openSpaceRequestDTO.rooms,
        openSpace.rooms
      )
    )
    openSpace.updateSlots(
      updatableItemCollectionService.getNewItems(openSpaceRequestDTO.slots),
      updatableItemCollectionService.getDeletedItems(
        openSpaceRequestDTO.slots,
        openSpace.slots
      )
    )
    openSpace.updateTracksAndAssociatedTalks(
      updatableItemCollectionService.getNewItems(openSpaceRequestDTO.tracks),
      deletedTracks,
      talksWithoutTrack
    )
    openSpace.removeInvalidAssignedSlots()

    openSpace.update(
      user,
      name = openSpaceRequestDTO.name,
      description = openSpaceRequestDTO.description
    )

    return openSpace
  }

  fun delete(userID: Long, openSpaceID: Long): Long {
    val user = findUser(userID)
    val openSpace = findById(openSpaceID)

    user.checkOwnershipOf(openSpace)
    openSpaceRepository.delete(openSpace)
    LOGGER.info("Success delete OpenSpace: $openSpace")
    return openSpace.id
  }

  @Transactional(readOnly = true)
  fun findAllByUser(userID: Long) =
    openSpaceRepository.findAllByOrganizerId(userID)

  @Transactional(readOnly = true)
  fun findById(id: Long): OpenSpace =
    openSpaceRepository.findById(id)
      .orElseThrow { OpenSpaceNotFoundException() }

  @Transactional(readOnly = true)
  fun findTrackById(id: Long) =
    trackRepository.findByIdOrNull(id) ?: throw TrackNotFoundException()

  private fun findByTalk(talkID: Long) =
    openSpaceRepository.findFirstOpenSpaceByTalkId(talkID)

  private fun findTalk(id: Long) =
    talkRepository.findByIdOrNull(id) ?: throw TalkNotFoundException()

  @Transactional(readOnly = true)
  fun findTalks(id: Long) =
    talkRepository.findAllByOpenSpaceIdOrderedByVotes(id).mapNotNull { it }

  fun createTalk(
    userID: Long,
    osID: Long,
    createTalkRequestDTO: CreateTalkRequestDTO
  ): Talk {
    val user = findUser(userID)
    val talk = createTalkFrom(createTalkRequestDTO, user = user)
    findById(osID).addTalk(talk)
    return talk
  }

  @Transactional(readOnly = true)
  fun findTalksOfUserInOpenSpace(userID: Long, openSpaceId: Long): List<Talk> {
    val openSpace = findById(openSpaceId)
    val user = findUser(userID)
    return openSpace.getUserTalks(user)
  }

  @Transactional(readOnly = true)
  @Cacheable(SCHEDULE_CACHE_NAME, key = "#id")
  fun findAssignedSlotsById(id: Long): List<AssignedSlotResponseDTO> {
    LOGGER.info("No hit cache $SCHEDULE_CACHE_NAME for findAssignedSlotsById with OpenSpace id=$id")
    return findById(id).assignedSlots.map {
      AssignedSlotTranslator.translateFrom(it)
    }
  }

  fun activateQueue(userID: Long, osID: Long) =
    findById(osID).activeQueue(findUser(userID))

  fun finishQueue(userID: Long, osID: Long) =
    findById(osID).finishQueuing(findUser(userID))

  fun enqueueTalk(userID: Long, talkID: Long): OpenSpace {
    val talk = findTalk(talkID)
    val openSpace = findByTalk(talkID)
    checkPermissions(talk, userID, openSpace)
    openSpace.enqueueTalk(talk)
    queueSocket.sendFor(openSpace)
    return openSpace
  }

  private fun checkOwnershipOpenSpace(user: User, openSpace: OpenSpace) {
    //TODO: Refactor to use User.checkOwnershipOf (but broke with null when call from user method)
    if (user.id != openSpace.organizer.id) {
      throw UserNotOwnerOfOpenSpaceException()
    }
  }

  private fun checkPermissions(
    talk: Talk,
    userID: Long,
    openSpace: OpenSpace
  ) {
    (!userIsSpeakerOf(talk, userID) && userIsOrganizerOf(
      openSpace,
      userID
    )) && throw TalkNotFoundException()
  }

  private fun userIsOrganizerOf(openSpace: OpenSpace, userID: Long) =
    openSpace.organizer.id == userID

  private fun userIsSpeakerOf(talk: Talk, userID: Long) =
    talk.speaker.id == userID


  fun toggleCallForPapers(openSpaceId: Long, userID: Long): OpenSpace {
    val openSpace = findById(openSpaceId)
    val user = findUser(userID)
    openSpace.toggleCallForPapers(user)
    return openSpace
  }

  fun toggleVoting(openSpaceId: Long, userID: Long): OpenSpace {
    val openSpace = findById(openSpaceId)
    val user = findUser(userID)
    openSpace.toggleVoting(user)
    return openSpace
  }

  fun toggleShowSpeakerName(openSpaceId: Long, userID: Long): OpenSpace {
    val openSpace = findById(openSpaceId)
    val user = findUser(userID)
    openSpace.toggleShowSpeakerName(user)
    return openSpace
  }

  private fun createTalkFrom(
    createTalkRequestDTO: CreateTalkRequestDTO,
    user: User
  ): Talk {
    val track: Track? = findTrack(createTalkRequestDTO.trackId)
    return Talk(
      name = createTalkRequestDTO.name,
      description = createTalkRequestDTO.description,
      meetingLink = createTalkRequestDTO.meetingLink,
      track = track,
      speaker = user,
      documents = createTalkRequestDTO.documents.toMutableSet(),
      isMarketplaceTalk = !createTalkRequestDTO.speakerName.isNullOrEmpty(),
      speakerName = createTalkRequestDTO.speakerName

    )
  }

  private fun findTrack(trackId: Long?): Track? {
    val track: Track? = trackId?.let {
      findTrackById(it)
    }
    return track
  }

  @Transactional
  fun deleteTalk(talkID: Long, openSpaceID: Long, userID: Long): Talk {
    val openSpace = findById(openSpaceID)
    val user = findUser(userID)
    val talk = findTalk(talkID)

    if (!userIsOrganizerOf(openSpace, userID)) {
      user.checkOwnershipOf(talk)
    }

    openSpace.removeTalk(talk)
    talkRepository.delete(talk)
    return talk
  }

  companion object {
    private val LOGGER = LoggerFactory.getLogger(this::class.java)
  }
}
