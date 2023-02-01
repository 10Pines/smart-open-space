package com.sos.smartopenspace.services

import com.sos.smartopenspace.domain.*
import com.sos.smartopenspace.helpers.CreateTalkDTO
import com.sos.smartopenspace.helpers.OpenSpaceDTO
import com.sos.smartopenspace.persistence.*
import com.sos.smartopenspace.websockets.QueueSocket
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
  private val queueSocket: QueueSocket
) {
  private fun findUser(userID: Long) = userService.findById(userID)

  fun create(userID: Long, openSpaceDTO: OpenSpaceDTO): OpenSpace {
    val openSpace = OpenSpace(
      name = openSpaceDTO.name,
      rooms = openSpaceDTO.rooms.toMutableSet(),
      slots = openSpaceDTO.slots.toMutableSet(),
      description = openSpaceDTO.description,
      tracks = openSpaceDTO.tracks.toMutableSet()
    )
    findUser(userID).addOpenSpace(openSpace)
    return openSpaceRepository.save(openSpace)
  }

  @Transactional
  fun update(userID: Long, openSpaceID: Long, openSpaceDTO: OpenSpaceDTO): OpenSpace? {
    val openSpace = findById(openSpaceID)
    val user = findUser(userID)

    openSpace.updateRooms(openSpaceDTO.rooms)
    openSpace.updateSlots(openSpaceDTO.slots)
    openSpace.updateTracks(openSpaceDTO.tracks)

    openSpace.update(
      user,
      name = openSpaceDTO.name,
      description = openSpaceDTO.description
    )

    return openSpace
  }
  
  @Transactional
  fun delete(userID: Long, openSpaceID: Long): Long {
    val user = findUser(userID)
    val openSpace = findById(openSpaceID)

    user.checkOwnershipOf(openSpace)

    user.removeOpenSpace(openSpace)
    openSpaceRepository.delete(openSpace)

    return openSpace.id
  }

  @Transactional(readOnly = true)
  fun findAllByUser(userID: Long) = findUser(userID).openSpaces.toList()

  @Transactional(readOnly = true)
  fun findById(id: Long) = openSpaceRepository.findByIdOrNull(id) ?: throw OpenSpaceNotFoundException()

  @Transactional(readOnly = true)
  fun findTrackById(id: Long) = trackRepository.findByIdOrNull(id) ?: throw TrackNotFoundException()

  fun createTalk(userID: Long, osID: Long, createTalkDTO: CreateTalkDTO): Talk {
    val talk = createTalkFrom(createTalkDTO)
    findById(osID).addTalk(talk)
    findUser(userID).addTalk(talk)
    return talk
  }

  @Transactional(readOnly = true)
  fun findTalksByUser(userID: Long, osID: Long) = talkRepository.findAllBySpeakerIdAndOpenSpaceId(userID, osID)

  @Transactional(readOnly = true)
  fun findAssignedSlotsById(id: Long) = findById(id).assignedSlots.toList()

  @Transactional(readOnly = true)
  fun findTalks(id: Long) = findById(id).talks.toList().sortedByDescending { it.votes() }

  fun activateQueue(userID: Long, osID: Long) =
    findById(osID).activeQueue(findUser(userID))

  fun finishQueue(userID: Long, osID: Long) =
    findById(osID).finishQueuing(findUser(userID))

  private fun findTalk(id: Long) = talkRepository.findByIdOrNull(id) ?: throw TalkNotFoundException()

  fun enqueueTalk(userID: Long, talkID: Long): OpenSpace {
    val talk = findTalk(talkID)
    (talk.speaker.id != userID && talk.openSpace.organizer.id != userID) && throw TalkNotFoundException()
    val os = talk.enqueue()
    queueSocket.sendFor(os)
    return os
  }

  fun toggleCallForPapers(openSpaceId: Long, userID: Long): OpenSpace {
    val openSpace = findById(openSpaceId)
    val user = findUser(userID)
    openSpace.toggleCallForPapers(user)
    return openSpace
  }

  private fun createTalkFrom(createTalkDTO: CreateTalkDTO): Talk {
    val track: Track? = findTrack(createTalkDTO.trackId)
    return Talk(
      name = createTalkDTO.name,
      description = createTalkDTO.description,
      meetingLink = createTalkDTO.meetingLink,
      track = track
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
    user.checkOwnershipOf(talk)

    openSpace.removeTalk(talk)
    user.removeTalk(talk)
    talkRepository.delete(talk)
    return talk
  }

}
