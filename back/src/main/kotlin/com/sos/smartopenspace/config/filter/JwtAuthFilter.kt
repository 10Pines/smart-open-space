package com.sos.smartopenspace.config.filter

import com.fasterxml.jackson.databind.ObjectMapper
import com.sos.smartopenspace.dto.DefaultErrorDto
import com.sos.smartopenspace.persistence.AuthSessionRepository
import com.sos.smartopenspace.services.impl.JwtService
import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import com.sos.smartopenspace.util.getNowUTC
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.ws.rs.core.HttpHeaders
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthFilter(
    private val jwtService: JwtService,
    private val authSessionRepository: AuthSessionRepository,
    private val objectMapper: ObjectMapper,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val now = getNowUTC()
        val executeNextFilter = {
            filterChain.doFilter(request, response)
        }

        if (EXCLUDED_JWT_PATHS.any { request.servletPath.startsWith(it) }) {
            executeNextFilter()
            return
        }

        val jwtTokenHeader = request.getHeader(HttpHeaders.AUTHORIZATION)
        if (jwtTokenHeader.isNullOrBlank() || !jwtTokenHeader.startsWith(TOKEN_PREFIX)) {
            LOGGER.error("Header authorization with bearer token not found in request")
            handlingAuthErrorWithMessage(
                response,
                "Header authorization with bearer token not found"
            )
            return
        }

        val jwtToken = jwtTokenHeader.substring(TOKEN_PREFIX.length)
        if (!jwtService.isValidToken(jwtToken)) {
            handlingAuthErrorWithMessage(response, "Jwt token is invalid or expired")
            return
        }

        //TODO: Review is this required to validate if the token is revoked every request or in each auth request???
        val userId = jwtService.extractUserId(jwtToken)
        authSessionRepository.findByTokenAndUserIdAndNotRevokedAndNotExpiredFrom(
            jwtToken,
            userId,
            now
        ) ?: run {
            LOGGER.error("Current jwt token was expired or revoked userId $userId and date_now $now")
            handlingAuthErrorWithMessage(response, "Token was expired or revoked")
            return
        }
        executeNextFilter()
    }

    private fun handlingAuthErrorWithMessage(response: HttpServletResponse, errMsg: String) {
        val status = HttpStatus.UNAUTHORIZED
        response.status = status.value()
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        response.writer.write(objectMapper.writeValueAsString(DefaultErrorDto(errMsg, status)))
    }

    companion object {
        private const val ANY_PREFIX = ""
        const val AUTH_PREFIX = "/v1/auth"

        //TODO: Should validate only in specific endpoints
        private val EXCLUDED_JWT_PATHS = listOf(
            ANY_PREFIX, // TODO: remove this line which match any path
            AUTH_PREFIX,
        )


        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }
}