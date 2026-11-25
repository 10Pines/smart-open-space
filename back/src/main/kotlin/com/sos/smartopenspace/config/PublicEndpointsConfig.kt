package com.sos.smartopenspace.config

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpMethod
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher


const val ANY_HTTP_METHOD = "ANY"
val PUBLIC_ENDPOINTS: Map<String, List<String>> = mapOf(
  ANY_HTTP_METHOD to listOf(
    "/scheduleSocket/**",
    "/queueSocket/**",
    "/v1/auth/**",
    "/user/**",
    "/actuator/health",
    "/actuator/metrics",
    "/actuator/prometheus",
    "/ping",
  ),
  HttpMethod.OPTIONS.name() to listOf(
    "/**",
  ),
  HttpMethod.GET.name() to listOf(
    "/**",
  ),
  HttpMethod.POST.name() to listOf(
    "/openSpace/talk/**",
    "/openSpace/*",
  ),
  HttpMethod.PUT.name() to listOf(
    "/openSpace/activateQueue/**",
    "/openSpace/finishQueue/**",
    "/openSpace/enqueueTalk/**",
    "/openSpace/*/user/*/callForPapers",
    "/openSpace/*/user/*/voting",
    "/openSpace/*/user/*/showSpeakerName",
    "/talk/nextTalk/**",
    "/talk/exchange/**",
    "/talk/schedule/**",
  ),
  HttpMethod.DELETE.name() to listOf(),
)

private val PUBLIC_ENDPOINT_MATCHERS: Map<String, List<PathPatternRequestMatcher>> =
  PUBLIC_ENDPOINTS.mapValues { (_, patterns) ->
    patterns.map { PathPatternRequestMatcher.pathPattern(it) }
  }

fun isPublicEndpoint(request: HttpServletRequest?): Boolean =
  request?.let {
    isPublicEndpointByMethod(ANY_HTTP_METHOD, request)
      || isPublicEndpointByMethod(request.method, request)
  } ?: false


private fun isPublicEndpointByMethod(
  method: String,
  request: HttpServletRequest
): Boolean =
  PUBLIC_ENDPOINT_MATCHERS[method]?.any { it.matches(request) } ?: false
