package com.sos.smartopenspace.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.MDC
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

@Component
class LogFilter : OncePerRequestFilter() {

    companion object {
        private const val REQUEST_ID_HEADER = "X-Request-Id"
        private const val CTX_REQUEST_ID_KEY = "requestId"
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val defaultRequestId = UUID.randomUUID().toString()
        val requestId = request.getHeader(REQUEST_ID_HEADER)?.ifBlank { defaultRequestId }
            ?: defaultRequestId
        MDC.put(CTX_REQUEST_ID_KEY, requestId)
        try {
            filterChain.doFilter(request, response)
        } finally {
            MDC.clear()
        }
    }

}