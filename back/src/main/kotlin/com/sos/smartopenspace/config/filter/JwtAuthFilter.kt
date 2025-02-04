package com.sos.smartopenspace.config.filter

import com.sos.smartopenspace.config.isPublicEndpoint
import com.sos.smartopenspace.domain.UnauthorizedException
import com.sos.smartopenspace.persistence.AuthSessionRepository
import com.sos.smartopenspace.services.impl.JwtService
import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import com.sos.smartopenspace.util.getNowUTC
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.ws.rs.core.HttpHeaders
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.servlet.HandlerExceptionResolver

@Component
class JwtAuthFilter(
    private val jwtService: JwtService,
    private val authSessionRepository: AuthSessionRepository,
    private val handlerExceptionResolver: HandlerExceptionResolver,
    private val userDetailsService: UserDetailsService,
) : OncePerRequestFilter() {

    override fun shouldNotFilter(request: HttpServletRequest): Boolean =
        isPublicEndpoint(request)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val now = getNowUTC()
        try {
            val jwtTokenHeader: String? = request.getHeader(HttpHeaders.AUTHORIZATION)
            if (jwtTokenHeader.doesNotContainBearerToken()) {
                throw UnauthorizedException("Jwt token is empty or invalid")
            }
            val jwtToken = jwtTokenHeader!!.substring(TOKEN_PREFIX.length)
            if (!jwtService.isValidToken(jwtToken)) {
                throw UnauthorizedException("Jwt token is invalid or expired")
            }
            val userId = jwtService.extractUserId(jwtToken)

            val authentication: Authentication? = SecurityContextHolder.getContext().authentication
            if (authentication == null) {
                authSessionRepository.findByTokenAndUserIdAndNotRevokedAndNotExpiredFrom(
                    jwtToken,
                    userId,
                    now
                ) ?: throw UnauthorizedException("Jwt token is invalid or expired")
                val userDetails = userDetailsService.loadUserByUsername(userId.toString())
                val authToken = UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.authorities
                )
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authToken
            }
            filterChain.doFilter(request, response)
        } catch (ex: Exception) {
            LOGGER.error("Current jwt token was expired or revoked with date_now $now")
            handlerExceptionResolver.resolveException(request, response, null, ex)
        }
    }

    private fun String?.doesNotContainBearerToken() =
        this == null || !this.startsWith(TOKEN_PREFIX)

    companion object {
        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }
}