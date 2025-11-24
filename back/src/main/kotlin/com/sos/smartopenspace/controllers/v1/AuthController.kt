package com.sos.smartopenspace.controllers.v1

import com.sos.smartopenspace.aspect.LoggingExecution
import com.sos.smartopenspace.aspect.LoggingInputExecution
import com.sos.smartopenspace.domain.BadRequestException
import com.sos.smartopenspace.domain.UnauthorizedException
import com.sos.smartopenspace.dto.request.auth.LoginRequestDTO
import com.sos.smartopenspace.dto.request.auth.PurgePasswordDTO
import com.sos.smartopenspace.dto.request.auth.RegisterRequestDTO
import com.sos.smartopenspace.dto.response.auth.AuthResponseDTO
import com.sos.smartopenspace.dto.response.auth.LogoutResponseDTO
import com.sos.smartopenspace.dto.response.purge.DeletedSessionsResponseDTO
import com.sos.smartopenspace.services.AuthServiceI
import com.sos.smartopenspace.translators.UserTranslator
import io.github.resilience4j.ratelimiter.annotation.RateLimiter
import jakarta.validation.Valid
import jakarta.ws.rs.core.HttpHeaders
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RateLimiter(name = "default")
@RestController
@RequestMapping("/v1/auth")
class AuthController(
  private val authService: AuthServiceI,
  @Value("\${auth.purge.password}")
  private val purgePassword: String,
) {

  @PostMapping("/register")
  @LoggingInputExecution
  fun register(@Valid @RequestBody registerReq: RegisterRequestDTO): AuthResponseDTO {
    val (_, jwt) =
      authService.register(UserTranslator.translateRegisterRequest(registerReq))
    return AuthResponseDTO(jwt)
  }

  @PostMapping("/login")
  @LoggingInputExecution
  fun login(@Valid @RequestBody authReq: LoginRequestDTO): AuthResponseDTO {
    val (_, jwt) = authService.login(authReq.email, authReq.password)
    return AuthResponseDTO(jwt)
  }

  @PostMapping("/logout")
  fun logout(@RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String): LogoutResponseDTO =
    authService.logout(authToken).let {
      LOGGER.info("Logout successfully with user_id=$it")
      LogoutResponseDTO(SUCCESS_LOGOUT_MESSAGE)
    }

  @PostMapping("/logout/all")
  fun logoutAllSessions(@RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String): LogoutResponseDTO =
    authService.logoutAllSessions(authToken).let {
      LOGGER.info("Logout from all sessions successfully user_id=$it")
      LogoutResponseDTO(SUCCESS_LOGOUT_ALL_MESSAGE)
    }

  @PostMapping("/validate/{userId}")
  fun validateToken(
    @RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String,
    @PathVariable("userId") userId: Long
  ) =
    mapOf("is_valid" to authService.validateToken(authToken, userId))

  @DeleteMapping("/purge/invalid-sessions")
  @LoggingExecution
  fun purgeInvalidSessions(
    @RequestParam(
      FILTER_CREATED_ON_FROM_NAME,
      required = false
    ) createdOnFromStr: String?,
    @RequestParam(
      FILTER_CREATED_ON_TO_NAME,
      required = false
    ) createdOnToStr: String?,
    @Valid @RequestBody purgePasswordDTO: PurgePasswordDTO,
  ): DeletedSessionsResponseDTO {
    if (!purgePassword.matchWithRequest(purgePasswordDTO)) {
      throw UnauthorizedException("Resource is forbidden")
    }
    var createdOnFrom = Instant.parse(FILTER_CREATION_ON_MIN)
    var createdOnTo = Instant.parse(FILTER_CREATION_ON_MAX)
    runCatching {
      createdOnFrom =
        createdOnFromStr?.let { Instant.parse(it) } ?: createdOnFrom
      createdOnTo = createdOnToStr?.let { Instant.parse(it) } ?: createdOnTo
    }.onFailure {
      throw BadRequestException(INVALID_TIME_DATE_FORMAT_MESSAGE)
    }
    if (!createdOnTo.isAfter(createdOnFrom)) {
      throw BadRequestException(INVALID_DATES_FILTER_MESSAGE)
    }
    LOGGER.info("Purging all invalid sessions between $FILTER_CREATED_ON_FROM_NAME=$createdOnFrom and $FILTER_CREATED_ON_TO_NAME=$createdOnTo")
    val countDeletedSessions =
      authService.purgeInvalidSessions(createdOnFrom, createdOnTo)
    LOGGER.info("Purged successfully '$countDeletedSessions' invalid sessions")
    return DeletedSessionsResponseDTO(
      deletedSessions = countDeletedSessions,
      creationDateFrom = createdOnFrom,
      creationDateTo = createdOnTo,
    )
  }

  private fun String.matchWithRequest(purgePasswordDTO: PurgePasswordDTO) =
    this == purgePasswordDTO.purgePassword

  companion object {
    const val FILTER_CREATED_ON_FROM_NAME = "created_on_from"
    const val FILTER_CREATED_ON_TO_NAME = "created_on_to"
    const val FILTER_CREATION_ON_MIN = "2024-01-01T00:00:00Z"
    const val FILTER_CREATION_ON_MAX = "4024-01-01T00:00:00Z"


    const val SUCCESS_LOGOUT_MESSAGE = "Sesión cerrada exitosamente"
    const val SUCCESS_LOGOUT_ALL_MESSAGE = "Sesiones cerradas exitosamente"

    private const val INVALID_TIME_DATE_FORMAT_MESSAGE =
      "Invalid time date format - use '2000-01-01T23:59:59Z'"
    private const val INVALID_DATES_FILTER_MESSAGE =
      "created_on_to should be after created_on_from"

    private val LOGGER = LoggerFactory.getLogger(this::class.java)
  }
}
