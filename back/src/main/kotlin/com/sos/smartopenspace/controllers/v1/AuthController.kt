package com.sos.smartopenspace.controllers.v1

import com.sos.smartopenspace.aspect.LoggingExecution
import com.sos.smartopenspace.aspect.LoggingInputExecution
import com.sos.smartopenspace.domain.BadRequestException
import com.sos.smartopenspace.dto.request.auth.LoginRequestDTO
import com.sos.smartopenspace.dto.request.auth.RegisterRequestDTO
import com.sos.smartopenspace.dto.response.auth.AuthResponseDTO
import com.sos.smartopenspace.dto.response.purge.DeletedSessionsResponseDTO
import com.sos.smartopenspace.services.AuthServiceI
import com.sos.smartopenspace.translators.UserTranslator
import jakarta.validation.Valid
import jakarta.ws.rs.core.HttpHeaders
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.time.Instant

@RestController
@RequestMapping("/v1/auth")
class AuthController(
    private val authService: AuthServiceI
) {

    @PostMapping("/register")
    @LoggingInputExecution
    fun register(@Valid @RequestBody registerReq: RegisterRequestDTO): AuthResponseDTO {
        val authSession = authService.register(UserTranslator.translateRegisterRequest(registerReq))
        return AuthResponseDTO(authSession.token)
    }

    @PostMapping("/login")
    @LoggingInputExecution
    fun login(@Valid @RequestBody authReq: LoginRequestDTO): AuthResponseDTO {
        val authSession = authService.login(authReq.email, authReq.password)
        return AuthResponseDTO(authSession.token)
    }

    @PostMapping("/logout")
    fun logout(@RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String) =
        authService.logout(authToken).also {
            LOGGER.info("Logout successfully")
        }

    @PostMapping("/logout/all")
    fun logoutAllSessions(@RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String) =
        authService.logoutAllSessions(authToken).also {
            LOGGER.info("Logout from all sessions successfully")
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
        @RequestParam(FILTER_CREATED_ON_FROM_NAME, required = false) createdOnFromStr: String?,
        @RequestParam(FILTER_CREATED_ON_TO_NAME, required = false) createdOnToStr: String?,
    ): DeletedSessionsResponseDTO {
        var createdOnFrom = Instant.parse(FILTER_CREATION_ON_MIN)
        var createdOnTo = Instant.parse(FILTER_CREATION_ON_MAX)
        runCatching {
            createdOnFrom = createdOnFromStr?.let { Instant.parse(it) } ?: createdOnFrom
            createdOnTo = createdOnToStr?.let { Instant.parse(it) } ?: createdOnTo
        }.onFailure {
            throw BadRequestException(INVALID_TIME_DATE_FORMAT_MESSAGE)
        }
        if (!createdOnTo.isAfter(createdOnFrom)) {
            throw BadRequestException(INVALID_DATES_FILTER_MESSAGE)
        }
        LOGGER.info("Purging all invalid sessions between $FILTER_CREATED_ON_FROM_NAME=$createdOnFrom and $FILTER_CREATED_ON_TO_NAME=$createdOnTo")
        val countDeletedSessions = authService.purgeInvalidSessions(createdOnFrom, createdOnTo)
        LOGGER.info("Purged successfully '$countDeletedSessions' invalid sessions")
        return DeletedSessionsResponseDTO(
            deletedSessions = countDeletedSessions,
            creationDateFrom = createdOnFrom,
            creationDateTo = createdOnTo,
        )
    }

    companion object {
        const val FILTER_CREATED_ON_FROM_NAME = "created_on_from"
        const val FILTER_CREATED_ON_TO_NAME = "created_on_to"
        const val FILTER_CREATION_ON_MIN = "2024-01-01T00:00:00Z"
        const val FILTER_CREATION_ON_MAX = "4024-01-01T00:00:00Z"


        private const val INVALID_TIME_DATE_FORMAT_MESSAGE = "Invalid time date format - use '2000-01-01T23:59:59Z'"
        private const val INVALID_DATES_FILTER_MESSAGE = "created_on_to should be after created_on_from"

        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }
}