package com.sos.smartopenspace.sampler

import com.sos.smartopenspace.domain.Talk
import com.sos.smartopenspace.domain.Track
import com.sos.smartopenspace.domain.User
import java.net.URI


object TalkSampler {

    fun get(): Talk = getWith()

    fun getWith(
        id: Long = 1,
        name: String = "talk-test",
        description: String = "This is a sample talk description.",
        speakerName: String = "user-test",
        speaker: User = UserSampler.get(),
        meetingLink: String? = null,
        track: Track? = null
    ): Talk =
        Talk(
            id = id,
            name = name,
            description = description,
            speakerName = speakerName,
            speaker = speaker,
            meetingLink = meetingLink?.let { URI.create(it).toURL() },
            track = track,
        )

}