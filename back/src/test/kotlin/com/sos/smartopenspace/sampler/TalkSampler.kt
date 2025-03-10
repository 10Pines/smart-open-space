package com.sos.smartopenspace.sampler

import com.sos.smartopenspace.domain.Talk
import com.sos.smartopenspace.domain.User


object TalkSampler {

    fun get(): Talk = getWith()

    fun getWith(
        id: Long = 1,
        name: String = "talk-test",
        speakerName: String = "user-test",
        speaker: User = UserSampler.get(),
    ): Talk =
        Talk(
            id = id,
            name = name,
            speakerName = speakerName,
            speaker = speaker,
        )

}