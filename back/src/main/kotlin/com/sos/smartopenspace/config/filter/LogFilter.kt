package com.sos.smartopenspace.config.filter

import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.ws.rs.core.HttpHeaders
import org.slf4j.MDC
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class LogFilter : OncePerRequestFilter() {

  companion object {
    private const val REQUEST_ID_HEADER = "X-Request-Id"
    private const val REQUEST_ID_SESSION = "X-Internal-Session-Id"

    private const val CTX_REQUEST_ID_KEY = "requestId"
    private const val CTX_REQUEST_SESSION_ID_KEY = "requestSessionId"
    private const val CTX_REQUEST_CONTAINS_JWT = "requestContainsJwt"

    private const val DEFAULT_EMPTY_VALUE = "none"
  }

  override fun doFilterInternal(
    request: HttpServletRequest,
    response: HttpServletResponse,
    filterChain: FilterChain
  ) {
    val defaultRequestId = UUID.randomUUID().toString()
    val requestId =
      request.getHeader(REQUEST_ID_HEADER)?.ifBlank { defaultRequestId }
        ?: defaultRequestId

    val requestSessionId =
      request.getHeader(REQUEST_ID_SESSION)?.ifBlank { DEFAULT_EMPTY_VALUE }
        ?: DEFAULT_EMPTY_VALUE

    val requestContainsJwt: Boolean =
      request.getHeader(HttpHeaders.AUTHORIZATION)?.let {
        it.contains(TOKEN_PREFIX) && it.length > TOKEN_PREFIX.length + 1
      } ?: false

    MDC.put(CTX_REQUEST_ID_KEY, requestId)
    MDC.put(CTX_REQUEST_SESSION_ID_KEY, requestSessionId)
    MDC.put(CTX_REQUEST_CONTAINS_JWT, requestContainsJwt.toString())
    filterChain.doFilter(request, response)
  }

}
