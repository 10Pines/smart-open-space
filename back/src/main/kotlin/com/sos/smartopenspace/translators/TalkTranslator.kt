package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.Talk
import com.sos.smartopenspace.dto.response.TalkResponseDTO

object TalkTranslator {
    fun translateFrom(domain: Talk) = TalkResponseDTO(
        id = domain.id,
        name = domain.name,
        description = domain.description,
        meetingLink = domain.meetingLink?.toString(),
        track = domain.track?.let { TrackTranslator.translateFrom(it) },
        speaker = UserTranslator.translateToUserResponse(domain.speaker),
        documents = domain.documents.map { DocumentTranslator.translateFrom(it) },
        reviews = domain.reviews.map { ReviewTranslator.translateFrom(it) },
        votingUsers = domain.votingUsers.map { UserTranslator.translateToUserResponse(it) },
        votes = domain.votes(),
        isMarketplaceTalk = domain.isMarketplaceTalk,
        speakerName = domain.speakerName,
    )
}