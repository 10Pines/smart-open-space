package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.aUser
import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.dto.DefaultErrorDto
import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import jakarta.ws.rs.core.HttpHeaders
import jakarta.ws.rs.core.MediaType
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

class ExceptionHandlerTest : BaseIntegrationTest() {

  @Test
  fun `test GIVEN invalid path THEN handle 404 not found`() {
    val res = mockMvc.perform(get("/not_exist_path"))

    res.andExpect(MockMvcResultMatchers.status().isNotFound)

    val resBody = readMvcResponseAndConvert<DefaultErrorDto>(res)


    val expectedRes = DefaultErrorDto(
      message = "No static resource not_exist_path.",
      statusCode = HttpStatus.NOT_FOUND.value(),
      status = HttpStatus.NOT_FOUND.name.lowercase(),
      isFallbackError = false
    )
    assertEquals(expectedRes, resBody)
  }

  @Test
  fun `test GIVEN valid path but invalid http method THEN handle 405 method_not_allowed`() {
    val res = mockMvc.perform(get("/user/auth"))

    res.andExpect(MockMvcResultMatchers.status().isMethodNotAllowed)

    val resBody = readMvcResponseAndConvert<DefaultErrorDto>(res)


    val expectedRes = DefaultErrorDto(
      message = "Request method 'GET' is not supported",
      statusCode = HttpStatus.METHOD_NOT_ALLOWED.value(),
      status = HttpStatus.METHOD_NOT_ALLOWED.name.lowercase(),
      isFallbackError = false
    )
    assertEquals(expectedRes, resBody)
  }

  @Test
  fun `test GIVEN invalid path parameter type and handle some endpoint which require a long type param THEN handle 400 bad request`() {
    val (_, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = getAnyUniqueEmail()))

    val res = mockMvc.perform(
      post("/talk/sarasa/user/xD/review")
        .contentType(MediaType.APPLICATION_JSON)
        .content("")
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )

    res.andExpect(MockMvcResultMatchers.status().isBadRequest)

    val resBody = readMvcResponseAndConvert<DefaultErrorDto>(res)


    val expectedRes = DefaultErrorDto(
      message = "Method parameter 'talkID': Failed to convert value of type 'java.lang.String' to required type 'long'; For input string: \"sarasa\"",
      statusCode = HttpStatus.BAD_REQUEST.value(),
      status = HttpStatus.BAD_REQUEST.name.lowercase(),
      isFallbackError = false
    )
    assertEquals(expectedRes, resBody)
  }

  @Test
  fun `test GIVEN invalid contentType and handle some endpoint which require APPLICATION_JSON as contentType THEN handle 400 bad request`() {
    val (_, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = getAnyUniqueEmail()))

    val res = mockMvc.perform(
      post("/talk/12/user/5/review")
        .contentType(MediaType.TEXT_PLAIN)
        .content("sarasa")
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )

    res.andExpect(MockMvcResultMatchers.status().isBadRequest)

    val resBody = readMvcResponseAndConvert<DefaultErrorDto>(res)


    val expectedRes = DefaultErrorDto(
      message = "Content-Type 'text/plain;charset=UTF-8' is not supported",
      statusCode = HttpStatus.BAD_REQUEST.value(),
      status = HttpStatus.BAD_REQUEST.name.lowercase(),
      isFallbackError = false
    )
    assertEquals(expectedRes, resBody)
  }

  @Test
  fun `test GIVEN empty content json and handle some endpoint which require json THEN handle 400 bad request`() {
    val (_, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = getAnyUniqueEmail()))

    val res = mockMvc.perform(
      post("/talk/12/user/5/review")
        .contentType(MediaType.APPLICATION_JSON)
        .content("")
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )

    res.andExpect(MockMvcResultMatchers.status().isBadRequest)

    val resBody = readMvcResponseAndConvert<DefaultErrorDto>(res)


    val expectedRes = DefaultErrorDto(
      message = "Required request body is missing: public com.sos.smartopenspace.dto.response.TalkResponseDTO com.sos.smartopenspace.controllers.TalkController.reviewTalk(java.lang.String,long,long,com.sos.smartopenspace.dto.request.CreateReviewRequestDTO)",
      statusCode = HttpStatus.BAD_REQUEST.value(),
      status = HttpStatus.BAD_REQUEST.name.lowercase(),
      isFallbackError = false
    )
    assertEquals(expectedRes, resBody)
  }

  @Test
  fun `test GIVEN invalid json content and handle some endpoint which require valid specific json THEN handle 400 bad request`() {
    val (_, aUserBearerToken) = registerAndGenerateAuthToken(aUser(userEmail = getAnyUniqueEmail()))

    val content = """{ "key": 123 """
    val res = mockMvc.perform(
      post("/talk/12/user/5/review")
        .contentType(MediaType.APPLICATION_JSON)
        .content(content)
        .header(HttpHeaders.AUTHORIZATION, aUserBearerToken)
    )

    res.andExpect(MockMvcResultMatchers.status().isBadRequest)

    val resBody = readMvcResponseAndConvert<DefaultErrorDto>(res)


    val expectedRes = DefaultErrorDto(
      message = "JSON parse error: Unexpected end-of-input: expected close marker for Object (start marker at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 1])",
      statusCode = HttpStatus.BAD_REQUEST.value(),
      status = HttpStatus.BAD_REQUEST.name.lowercase(),
      isFallbackError = false
    )
    assertEquals(expectedRes, resBody)
  }

  @Test
  fun `test GIVEN valid request but throws unexpected exception THEN should return internal server error`() {
    val res = mockMvc.perform(get("/test/internal_server_error"))

    res.andExpect(MockMvcResultMatchers.status().isInternalServerError)

    val resBody = readMvcResponseAndConvert<DefaultErrorDto>(res)

    val expectedStatusCode = HttpStatus.INTERNAL_SERVER_ERROR
    assertEquals("test error fallback", resBody.message)
    assertEquals(expectedStatusCode.value(), resBody.statusCode)
    assertEquals(expectedStatusCode.name.lowercase(), resBody.status)
    assertTrue(resBody.isFallbackError)
  }

  private fun registerAndGenerateAuthToken(userToRegister: User): Pair<User, String> {
    val (_, token) = authService.register(userToRegister)
    val user = userRepo.findByEmail(userToRegister.email)
      ?: throw IllegalStateException("User not created")
    return user to "$TOKEN_PREFIX$token"
  }

}
