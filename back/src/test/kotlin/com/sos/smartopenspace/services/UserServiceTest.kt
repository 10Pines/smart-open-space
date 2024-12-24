package com.sos.smartopenspace.services

import com.sos.smartopenspace.sampler.UserSampler
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

@Transactional
class UserServiceTest: BaseServiceTest() {

    @Autowired
    lateinit var userService: UserService

    @Test
    fun `generate reset token for user saves reset token`() {
        val user = userService.create(UserSampler.get())

        userService.generatePasswordResetToken(user)

        Assertions.assertNotNull(userService.findByEmail(user.email).resetToken)
    }

}