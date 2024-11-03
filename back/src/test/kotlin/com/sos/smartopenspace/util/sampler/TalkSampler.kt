package com.sos.smartopenspace.util.sampler

import com.sos.smartopenspace.domain.Talk
import com.sos.smartopenspace.domain.User


class TalkSampler private constructor() {
    companion object {
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
}