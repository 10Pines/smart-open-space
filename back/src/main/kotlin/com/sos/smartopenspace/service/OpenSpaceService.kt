package com.sos.smartopenspace.service

import com.sos.smartopenspace.model.OpenSpace
import com.sos.smartopenspace.model.Talk
import com.sos.smartopenspace.persistence.OpenSpaceRepository
import com.sos.smartopenspace.persistence.TalkRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

class OpenSpaceNotFoundException : RuntimeException("OpenSpace no encontrado")
class TalkNotFoundException : RuntimeException("Charla no encontrada")
class RoomNotFoundException : RuntimeException("Sala no encontrada")

@Service
@Transactional
class OpenSpaceService(
  private val openSpaceRepository: OpenSpaceRepository,
  private val talkRepository: TalkRepository,
  private val userService: UserService
) {
  fun create(userID: Long, openSpace: OpenSpace): OpenSpace {
    openSpace.organizer = userService.findById(userID)
    return openSpaceRepository.save(openSpace)
  }

  fun findAllByUser(userID: Long) = userService.findById(userID).openSpaces.toList()

  fun findById(id: Long) = openSpaceRepository.findByIdOrNull(id) ?: throw OpenSpaceNotFoundException()

  fun createTalk(userID: Long, osID: Long, talk: Talk) {
    findById(osID).addTalk(talk)
    userService.findById(userID).addTalk(talk)
  }

  fun findTalks(userID: Long, osID: Long) = talkRepository.findAllBySpeakerIdAndOpenSpaceId(userID, osID)

  fun findSlotsById(id: Long) = findById(id).slots.toList()
}
