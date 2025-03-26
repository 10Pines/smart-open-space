package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.aspect.LoggingInputExecution
import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.dto.request.RecoveryEmailRequestDTO
import com.sos.smartopenspace.dto.request.UserLoginRequestDTO
import com.sos.smartopenspace.dto.request.UserValidateTokenRequestDTO
import com.sos.smartopenspace.services.EmailService
import com.sos.smartopenspace.services.UserService
import com.sos.smartopenspace.translators.UserTranslator
import io.github.resilience4j.ratelimiter.annotation.RateLimiter
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RateLimiter(name = "default")
@RestController
@RequestMapping("user")
class UserController(private val userService: UserService, private val emailService: EmailService) {

  @Deprecated("Use '/v1/auth/register' endpoint", level = DeprecationLevel.WARNING)
  @PostMapping
  @LoggingInputExecution
  fun create(@Valid @RequestBody user: User) =
    UserTranslator.translateToUserResponse(userService.create(user))

  @Deprecated("Use '/v1/auth/login' endpoint", level = DeprecationLevel.WARNING)
  @PostMapping("/auth")
  @LoggingInputExecution
  fun auth(@Valid @RequestBody user: UserLoginRequestDTO) =
    UserTranslator.translateToUserResponse(userService.findUserAndMatchPassword(user.email, user.password))

  @PostMapping("/recovery")
  @LoggingInputExecution
  fun sendRecoveryEmail(@Valid @RequestBody user: RecoveryEmailRequestDTO) =
    UserTranslator.translateToUserResponse(emailService.sendRecoveryEmail(user.email))

  @PostMapping("/reset")
  @LoggingInputExecution
  fun resetPassword(@Valid @RequestBody user: UserValidateTokenRequestDTO) =
    UserTranslator.translateToUserResponse(userService.resetPassword(user.email, user.resetToken, user.password))
}
