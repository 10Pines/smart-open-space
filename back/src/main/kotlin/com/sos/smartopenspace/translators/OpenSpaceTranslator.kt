package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.OpenSpace
import com.sos.smartopenspace.dto.response.OpenSpaceResponseDTO

object OpenSpaceTranslator {
    fun translateFrom(domain: OpenSpace) = OpenSpaceResponseDTO(
        id = domain.id,
        name = domain.name,
        description = domain.description,
        urlImage = domain.urlImage,
        queueState = domain.queueState,
        isActiveCallForPapers = domain.isActiveCallForPapers,
        startTime = domain.startTime(),
        endTime = domain.endTime(),
        startDate = domain.startDate(),
        endDate = domain.endDate(),
        pendingQueue = domain.isPendingQueue(),
        activeQueue = domain.isActiveQueue(),
        finishedQueue = domain.isFinishedQueue(),
        amountOfTalks = domain.amountOfTalks(),
        dates = domain.dates(),
        organizer = UserTranslator.translateToUserResponse(domain.organizer),
        rooms = domain.rooms.map { RoomTranslator.translateFrom(it) },
        slots = domain.slots.map { SlotTranslator.translateFrom(it) },
        tracks = domain.tracks.map { TrackTranslator.translateFrom(it) },
        toSchedule = domain.toSchedule.map { TalkTranslator.translateFrom(it) },
        freeSlots = domain.freeSlots().map { (room, slots) ->
            RoomTranslator.translateFrom(room) to slots.map { SlotTranslator.translateFrom(it) }
        },
        assignableSlots = domain.assignableSlots().map { (room, slots) ->
            RoomTranslator.translateFrom(room) to slots.map { SlotTranslator.translateFrom(it) }
        },
        isActiveVoting = domain.isActiveVoting,
        showSpeakerName = domain.showSpeakerName,
    )
}