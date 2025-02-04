package com.sos.smartopenspace.config

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpMethod
import org.springframework.security.web.util.matcher.AntPathRequestMatcher


const val ANY_HTTP_METHOD = "ANY"
val PUBLIC_ENDPOINTS: Map<String, List<AntPathRequestMatcher>> = mapOf(
    ANY_HTTP_METHOD to listOf(
        AntPathRequestMatcher("/v1/auth/**"),
        AntPathRequestMatcher("/user/**"),
        AntPathRequestMatcher("/actuator/health"),
        AntPathRequestMatcher("/actuator/metrics"),
        AntPathRequestMatcher("/actuator/prometheus"),
        AntPathRequestMatcher("/ping"),
    ),
    HttpMethod.GET.name() to listOf(
        AntPathRequestMatcher("/**"),
    ),
    HttpMethod.POST.name() to listOf(
        AntPathRequestMatcher("/openSpace/talk/**"),
        AntPathRequestMatcher("/openSpace/*"),
    ),
    HttpMethod.PUT.name() to listOf(
        AntPathRequestMatcher("/openSpace/activateQueue/**"),
        AntPathRequestMatcher("/openSpace/finishQueue/**"),
        AntPathRequestMatcher("/openSpace/enqueueTalk/**"),
        AntPathRequestMatcher("/openSpace/*/user/*/callForPapers"),
        AntPathRequestMatcher("/openSpace/*/user/*/voting"),
        AntPathRequestMatcher("/openSpace/*/user/*/showSpeakerName"),
        AntPathRequestMatcher("/talk/nextTalk/**"),
        AntPathRequestMatcher("/talk/exchange/**"),
        AntPathRequestMatcher("/talk/schedule/**"),
    ),
    HttpMethod.DELETE.name() to listOf(),
)

fun isPublicEndpoint(request: HttpServletRequest?): Boolean =
    request?.let {
        isPublicEndpointByMethod(ANY_HTTP_METHOD, request)
                || isPublicEndpointByMethod(request.method, request)
    } ?: false


private fun isPublicEndpointByMethod(method: String, request: HttpServletRequest): Boolean =
    PUBLIC_ENDPOINTS[method]?.any { it.matches(request) } ?: false