package com.sos.smartopenspace.services

import com.google.common.hash.Hashing
import com.sos.smartopenspace.domain.UnauthorizedException
import com.sos.smartopenspace.domain.UserNotFoundException
import com.sos.smartopenspace.sampler.UserSampler
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import java.nio.charset.StandardCharsets

@Transactional
class UserServiceTest : BaseServiceTest() {

  @Autowired
  lateinit var userService: UserService

  @Test
  fun `generate reset token for user saves reset token`() {
    val user = userService.create(UserSampler.get())

    userService.generatePasswordResetToken(user)

    assertNotNull(userService.findByEmail(user.email).resetToken)
  }

  @Test
  fun `resetPassword with user with null resetTokenLifeTime Should throws UnauthorizedException`() {
    val userEmail = "pepegrillo@xd.com"
    val pass = "password123"
    val user = UserSampler.getWith(
      email = userEmail,
      password = pass,
    )
    val resetTokenRaw = "resetToken123"
    val resetToken = Hashing.sha256()
      .hashString(resetTokenRaw, StandardCharsets.UTF_8)
      .toString()
    user.resetToken = resetToken
    user.resetTokenLifetime = null
    userService.create(user)

    // WHEN + THEN
    val newPassword = "newPassword123"
    val ex = assertThrows<UnauthorizedException> {
      userService.resetPassword(userEmail, resetTokenRaw, newPassword)
    }
    assertEquals("El token esta vencido", ex.message)
  }

  @Test
  fun `resetPassword with user resetTokenLifeTime lower than currentTimeMillis Should throws UnauthorizedException`() {
    val userEmail = "pepegrillo@xd.com"
    val pass = "password123"
    val user = UserSampler.getWith(
      email = userEmail,
      password = pass,
    )
    val resetTokenRaw = "resetToken123"
    val resetToken = Hashing.sha256()
      .hashString(resetTokenRaw, StandardCharsets.UTF_8)
      .toString()
    user.resetToken = resetToken
    user.resetTokenLifetime = System.currentTimeMillis() - 1000 // Set to a past time
    userService.create(user)

    // WHEN + THEN
    val newPassword = "newPassword123"
    val ex = assertThrows<UnauthorizedException> {
      userService.resetPassword(userEmail, resetTokenRaw, newPassword)
    }
    assertEquals("El token esta vencido", ex.message)
  }

  @Test
  fun `findById with userID which not exist should throws UserNotFoundException`() {
    assertThrows<UserNotFoundException> {
      userService.findById(999999)
    }
  }

  @Test
  fun `findByEmail with email which not exist should throws UserNotFoundException`() {
    assertThrows<UserNotFoundException> {
      userService.findByEmail("notExistEmail@sarasa.xd")
    }
  }

}