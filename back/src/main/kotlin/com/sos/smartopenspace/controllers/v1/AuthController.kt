package com.sos.smartopenspace.controllers.v1

import com.sos.smartopenspace.aspect.LoggingInputExecution
import com.sos.smartopenspace.dto.response.auth.AuthResponseDTO
import com.sos.smartopenspace.dto.request.auth.LoginRequestDTO
import com.sos.smartopenspace.dto.request.auth.RegisterRequestDTO
import com.sos.smartopenspace.services.AuthServiceI
import com.sos.smartopenspace.translators.UserTranslator
import jakarta.validation.Valid
import jakarta.ws.rs.core.HttpHeaders
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

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
    fun validateToken(@RequestHeader(HttpHeaders.AUTHORIZATION) authToken: String, @PathVariable("userId") userId: Long) =
        mapOf("is_valid" to authService.validateToken(authToken, userId))

    companion object {
        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }
}