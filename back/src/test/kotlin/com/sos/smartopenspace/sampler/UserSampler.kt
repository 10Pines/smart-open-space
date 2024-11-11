package com.sos.smartopenspace.sampler

import com.sos.smartopenspace.domain.User

class UserSampler private constructor() {
    companion object {
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
                name = "testuser",
                password = "password"
            )
    }
}