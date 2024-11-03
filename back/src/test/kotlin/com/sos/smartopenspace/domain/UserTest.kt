package com.sos.smartopenspace.domain;

import com.sos.smartopenspace.util.sampler.TalkSampler
import com.sos.smartopenspace.util.sampler.UserSampler
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test


class UserTest {

    @Test
    fun `GIVEN user1 and talk with speaker user1 WHEN user1 isOwnerOf that talk THEN should be return truthy`() {
        val user = UserSampler.getWith(id = 1)
        val talk = TalkSampler.getWith(speaker = user)

        assertTrue(user.isOwnerOf(talk))
    }

    @Test
    fun `GIVEN user1 and talk with speaker user2 WHEN user1 isOwnerOf that talk THEN should be return falsy`() {
        val user1 = UserSampler.getWith(id = 1)
        val user2 = UserSampler.getWith(id = 2)
        val talk = TalkSampler.getWith(speaker = user2)

        assertFalse(user1.isOwnerOf(talk))
    }

    //TODO: Add more domain method tests

}
