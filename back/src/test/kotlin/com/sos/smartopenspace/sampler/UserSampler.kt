package com.sos.smartopenspace.sampler

import com.sos.smartopenspace.domain.User

object UserSampler {

    fun get(): User = getWith()

    fun getWith(
        id: Long = 1,
        email: String = "test@mail.com",
        name: String = "testuser",
        password: String = "password",
    ): User =
        User(
            id = id,
            email = email,
            name = name,
            password = password
        )

}