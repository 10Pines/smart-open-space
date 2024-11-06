package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.aspect.LoggingInputExecution
import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.dto.request.RecoveryEmailRequestDTO
import com.sos.smartopenspace.dto.request.UserLoginRequestDTO
import com.sos.smartopenspace.dto.request.UserValidateTokenRequestDTO
import com.sos.smartopenspace.services.EmailService
import com.sos.smartopenspace.services.UserService
import com.sos.smartopenspace.translators.response.UserResTranslator
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("user")
class UserController(private val userService: UserService, private val emailService: EmailService) {
  @PostMapping
  @LoggingInputExecution
  fun create(@Valid @RequestBody user: User) =
    UserResTranslator.translateFrom(userService.create(user))

  @PostMapping("/auth")
  @LoggingInputExecution
  fun auth(@Valid @RequestBody user: UserLoginRequestDTO) =
    UserResTranslator.translateFrom(userService.auth(user.email, user.password))

  @PostMapping("/recovery")
  @LoggingInputExecution
  fun sendRecoveryEmail(@Valid @RequestBody user: RecoveryEmailRequestDTO) =
    UserResTranslator.translateFrom(emailService.sendRecoveryEmail(user.email))

  @PostMapping("/reset")
  @LoggingInputExecution
  fun resetPassword(@Valid @RequestBody user: UserValidateTokenRequestDTO) =
    UserResTranslator.translateFrom(userService.resetPassword(user.email, user.resetToken, user.password))
}
