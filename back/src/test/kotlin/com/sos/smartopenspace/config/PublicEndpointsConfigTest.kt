package com.sos.smartopenspace.config

import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import jakarta.servlet.http.HttpServletRequest
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.CsvSource
import org.junit.jupiter.params.provider.MethodSource
import org.springframework.http.HttpMethod

class PublicEndpointsConfigTest {

  @MockK
  private lateinit var request: HttpServletRequest

  @BeforeEach
  fun setUp() =
    MockKAnnotations.init(this)

  @Test
  fun `test isPublicEndpoint with request null Should be falsy`() {
    assertFalse(isPublicEndpoint(null))
  }

  @ParameterizedTest
  @CsvSource(
    value = [
      "/sarasa",
      "/test",
      "/",
      "/talk/123",
      "/openSpace/user/321",
      "/openSpace/555",
      "/openSpace/talks/3/132141",
      "/openSpace/talks/414",
      "/openSpace/assignedSlots/13"
    ]
  )
  fun `test isPublicEndpoint with GET method and any uri Should be truthy`(
    endpoint: String
  ) {
    every { request.method } returns HttpMethod.GET.name()
    every { request.requestURI } returns endpoint
    every { request.servletPath } returns endpoint
    every { request.pathInfo } returns null
    assertTrue(isPublicEndpoint(request))
  }

  @ParameterizedTest
  @CsvSource(
    value = [
      "POST,/openSpace/12",
      "POST,/openSpace/talk/123",
      "PUT,/openSpace/activateQueue/123",
      "PUT,/openSpace/finishQueue/42",
      "PUT,/openSpace/enqueueTalk/142",
      "PUT,/openSpace/123/user/5/callForPapers",
      "PUT,/openSpace/54/user/132/voting",
      "PUT,/openSpace/3346/user/4324/showSpeakerName",
      "PUT,/talk/nextTalk/414",
      "PUT,/talk/exchange/5453",
      "PUT,/talk/schedule/64536456"
    ]
  )
  fun `test isPublicEndpoint with not get method and public uri Should be truthy`(
    method: String, endpoint: String
  ) {
    every { request.method } returns HttpMethod.valueOf(method).name()
    every { request.requestURI } returns endpoint
    every { request.servletPath } returns endpoint
    every { request.pathInfo } returns null
    assertTrue(isPublicEndpoint(request))
  }

  @ParameterizedTest
  @CsvSource(
    value = [
      "POST,/",
      "PUT,/",
      "DELETE,/",
      "PATCH,/",
      "POST,/not_exist_endpoint_as_public",
      "PUT,/not_exist_endpoint_as_public",
      "DELETE,/not_exist_endpoint_as_public",
      "PATCH,/not_exist_endpoint_as_public",
      "PUT,/talk/132/user/1421",
      "PUT,/talk/41/user/4124/vote",
      "PUT,/talk/541/user/3/unvote",
      "PUT,/talk/523/user/421/review",
      "PUT,/openSpace/3232/user/31",
      "DELETE,/openSpace/3232/user/31",
      "DELETE,/openSpace/324/talk/123/user/1",
      "POST,/openSpace/2215/resourceX"
    ]
  )
  fun `test isPublicEndpoint with not match endpoint and method as public Should be falsy`(
    method: String, endpoint: String
  ) {
    every { request.method } returns HttpMethod.valueOf(method).name()
    every { request.requestURI } returns endpoint
    every { request.servletPath } returns endpoint
    every { request.pathInfo } returns null
    assertFalse(isPublicEndpoint(request))
  }

  @ParameterizedTest(name = "{0}")
  @MethodSource("getAllPublicEndpointsWithAnyMethod")
  fun `test isPublicEndpoint with public endpoint and any http method Should be truthy`(
    caseName: String, httpMethod: String, endpoint: String
  ) {
    every { request.method } returns httpMethod
    every { request.requestURI } returns endpoint
    every { request.servletPath } returns endpoint
    every { request.pathInfo } returns null
    assertTrue(isPublicEndpoint(request))
  }

  companion object {
    private val ALL_HTTP_METHODS: Set<String> =
      HttpMethod.values().map { it.name() }.toSet()


    @JvmStatic
    fun getAllPublicEndpointsWithAnyMethod(): List<Arguments> {
      val authEndpoints = listOf(
        "/login",
        "/register",
        "/logout",
        "/logout/all",
        "/validate/1",
        "/purge/invalid-sessions"
      ).map { "/v1/auth$it" }
      val userEndpoints = listOf(
        "",
        "/auth",
        "/recovery",
        "/reset"
      ).map { "/user$it" }
      val allAnyMethodPublicEndpoints =
        authEndpoints + userEndpoints + listOf(
          "/actuator/health",
          "/actuator/metrics",
          "/actuator/prometheus",
          "/ping"
        )

      return allAnyMethodPublicEndpoints.flatMap {
        ALL_HTTP_METHODS.map { method ->
          val testName = "Case $method $it"
          Arguments.of(testName, method, it)
        }
      }
    }
  }
}
