package com.sos.smartopenspace.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.MDC
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

@Component
class LogFilterConfig : OncePerRequestFilter() {

    companion object {
        private const val REQUEST_ID_HEADER = "X-Request-Id"
        private const val REQUEST_ID_SESSION = "X-Internal-Session-Id"

        private const val CTX_REQUEST_ID_KEY = "requestId"
        private const val CTX_REQUEST_SESSION_ID_KEY = "requestSessionId"

        private const val DEFAULT_EMPTY_VALUE = "none"
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val defaultRequestId = UUID.randomUUID().toString()
        val requestId = request.getHeader(REQUEST_ID_HEADER)?.ifBlank { defaultRequestId }
            ?: defaultRequestId

        val requestSessionId = request.getHeader(REQUEST_ID_SESSION)?.ifBlank { DEFAULT_EMPTY_VALUE }
            ?: DEFAULT_EMPTY_VALUE

        MDC.put(CTX_REQUEST_ID_KEY, requestId)
        MDC.put(CTX_REQUEST_SESSION_ID_KEY, requestSessionId)
        filterChain.doFilter(request, response)
    }

}