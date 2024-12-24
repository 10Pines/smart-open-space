package com.sos.smartopenspace.controllers.v1

import com.sos.smartopenspace.controllers.BaseControllerTest
import com.sos.smartopenspace.domain.AuthSession
import com.sos.smartopenspace.domain.InvalidTokenException
import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.domain.UserUnauthorizedException
import com.sos.smartopenspace.persistence.AuthSessionRepository
import com.sos.smartopenspace.sampler.AuthSessionSampler
import com.sos.smartopenspace.sampler.UserSampler
import com.sos.smartopenspace.services.UserService
import com.sos.smartopenspace.services.impl.AuthService
import com.sos.smartopenspace.services.impl.JwtService
import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import com.sos.smartopenspace.testUtil.ReadMocksHelper
import com.sos.smartopenspace.testUtil.extractJsonApiErrorMessage
import com.sos.smartopenspace.testUtil.extractJsonPathValue
import com.sos.smartopenspace.util.getNowUTC
import jakarta.ws.rs.core.HttpHeaders
import jakarta.ws.rs.core.MediaType
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.nio.charset.StandardCharsets
import java.time.temporal.ChronoUnit

class AuthControllerTest : BaseControllerTest() {

    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var authSessionRepo: AuthSessionRepository

    @Autowired
    lateinit var authService: AuthService

    @Autowired
    lateinit var jwtService: JwtService

    @Test
    fun `register with register request dto should be http ok and return AuthResponseDto`() {
        val registerReqDtoMockFile = "valid_register_request.json"
        val registerReqDtoMockStr =
            ReadMocksHelper.readAuthMocksFile(REGISTER_MOCKS_DIR + registerReqDtoMockFile)
        val userEmail = extractJsonPathValue<String>(registerReqDtoMockStr, "$.email")
            ?: fail("not email provided")
        val userPassword = extractJsonPathValue<String>(registerReqDtoMockStr, "$.password")
            ?: fail("not password provided")

        // WHEN
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(REGISTER_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding(StandardCharsets.UTF_8)
                .content(registerReqDtoMockStr)
        )
        // THEN
        val responseBodyStr =
            httpResponse.andExpect(status().isOk).andReturn().response.getContentAsString(
                StandardCharsets.UTF_8
            )
        val token =
            extractJsonPathValue<String>(responseBodyStr, "$.token")
                ?: fail("Response token not found")
        assertTrue(jwtService.isValidToken(token))
        val savedUser = userService.findUserAndMatchPassword(userEmail, userPassword)
        val userIdJwt = jwtService.extractUserId(token)
        assertEquals(savedUser.id, userIdJwt)

        val authSession = authSessionRepo.findByTokenAndUserIdAndNotRevokedAndNotExpiredFrom(
            token,
            userIdJwt,
            getNowUTC()
        ) ?: fail("Auth session not found")
        assertFalse(authSession.id.isBlank())
        assertNotNull(authSession.user)
        assertEquals(authSession.user.id, userIdJwt)
        assertEquals(authSession.token, token)
        assertFalse(authSession.revoked)
    }


    @ParameterizedTest(name = "{0}")
    @CsvSource(
        "invalid register request text,invalid_register_text.txt,''",
        "invalid register request empty name,invalid_register_empty_name.json,Ingrese un nombre",
        "invalid register request blank name,invalid_register_blank_name.json,Ingrese un nombre",
        "invalid register request long name,invalid_register_long_name.json,El nombre no puede superar los 150 caracteres",
        "invalid register request empty password,invalid_register_empty_password.json,La contraseña debe tener al menos entre 4 a 150 caracteres",
        "invalid register request blank password,invalid_register_blank_password.json,La contraseña debe tener al menos entre 4 a 150 caracteres",
        "invalid register request long password,invalid_register_long_password.json,La contraseña debe tener al menos entre 4 a 150 caracteres",
        "invalid register request short password,invalid_register_short_password.json,La contraseña debe tener al menos entre 4 a 150 caracteres",
        "invalid register request empty email,invalid_register_empty_email.json,Ingrese un email válido",
        "invalid register request not email,invalid_register_not_email.json,Ingrese un email válido",
        "invalid register request long email,invalid_register_long_email.json,Ingrese un email válido",
    )
    fun `register with register request dto should be http bad request`(
        testName: String,
        filename: String,
        expectedErrorMsg: String,
    ) {
        val registerReqDtoMockStr = ReadMocksHelper.readAuthMocksFile(REGISTER_MOCKS_DIR + filename)
        // WHEN
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(REGISTER_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding(StandardCharsets.UTF_8)
                .content(registerReqDtoMockStr),
        )
        // THEN
        val responseBodyStr =
            httpResponse.andExpect(status().isBadRequest).andReturn().response.getContentAsString(
                StandardCharsets.UTF_8
            )
        assertNotNull(responseBodyStr)
        if (expectedErrorMsg.isNotBlank()) {
            val responseErrMsg = extractJsonApiErrorMessage<String>(responseBodyStr)
                ?: fail("Response error message not found")
            assertEquals(expectedErrorMsg, responseErrMsg)
        }
    }

    @Test
    fun `test login with login request dto should be http ok and return AuthResponseDto`() {
        val loginReqDtoMockFile = "valid_login_request.json"
        val loginReqDtoMockStr =
            ReadMocksHelper.readAuthMocksFile(LOGIN_MOCKS_DIR + loginReqDtoMockFile)
        val emailRequest = extractJsonPathValue<String>(loginReqDtoMockStr, "$.email")
            ?: fail("not email provided")
        val passwordRequest = extractJsonPathValue<String>(loginReqDtoMockStr, "$.password")
            ?: fail("not email provided")
        createUserWithEmailAndPassword(emailRequest, passwordRequest)
        val savedUser = userService.findUserAndMatchPassword(emailRequest, passwordRequest)

        // WHEN
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(LOGIN_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding(StandardCharsets.UTF_8)
                .content(loginReqDtoMockStr)
        )
        // THEN
        val responseBodyStr =
            httpResponse.andExpect(status().isOk).andReturn()
                .response.getContentAsString(StandardCharsets.UTF_8)
        val token =
            extractJsonPathValue<String>(responseBodyStr, "$.token")
                ?: fail("Response token not found")
        assertTrue(jwtService.isValidToken(token))
        val userIdJwt = jwtService.extractUserId(token)
        assertEquals(savedUser.id, userIdJwt)

        val authSession = authSessionRepo.findByTokenAndUserIdAndNotRevokedAndNotExpiredFrom(
            token,
            userIdJwt,
            getNowUTC()
        ) ?: fail("Auth session not found")
        assertFalse(authSession.id.isBlank())
        assertNotNull(authSession.user)
        assertEquals(authSession.user.id, userIdJwt)
        assertEquals(authSession.token, token)
        assertFalse(authSession.revoked)
    }

    @Test
    fun `test login with login request dto with not match password should be http 401`() {
        val loginReqDtoMockFile = "valid_login_request_2.json"
        val loginReqDtoMockStr =
            ReadMocksHelper.readAuthMocksFile(LOGIN_MOCKS_DIR + loginReqDtoMockFile)
        val emailRequest = extractJsonPathValue<String>(loginReqDtoMockStr, "$.email")
            ?: fail("not email provided")
        val passwordRequest = extractJsonPathValue<String>(loginReqDtoMockStr, "$.password")
            ?: fail("not email provided")

        val savedPassword = "extended_$passwordRequest!@xD"
        createUserWithEmailAndPassword(emailRequest, savedPassword)
        userService.findUserAndMatchPassword(emailRequest, savedPassword)

        // WHEN
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(LOGIN_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding(StandardCharsets.UTF_8)
                .content(loginReqDtoMockStr)
        )
        // THEN
        val responseBodyStr =
            httpResponse.andExpect(status().isUnauthorized).andReturn()
                .response.getContentAsString(StandardCharsets.UTF_8)
        assertNotNull(responseBodyStr)
        val responseErrMsg = extractJsonApiErrorMessage<String>(responseBodyStr)
            ?: fail("Response error message not found")
        assertEquals(UserUnauthorizedException().message, responseErrMsg)
    }

    @ParameterizedTest(name = "{0}")
    @CsvSource(
        "invalid login request empty email,invalid_register_empty_email.json,Ingrese un email válido",
        "invalid login request not email,invalid_register_not_email.json,Ingrese un email válido",
        "invalid login request empty password,invalid_register_empty_password.json,Ingrese una contraseña",
        "invalid login request long password,invalid_register_long_password.json,Contraseña muy larga",
    )
    fun `test login with invalid login request dto should be http bad request`(
        testName: String,
        filename: String,
        expectedErrorMsg: String,
    ) {
        val loginReqDtoMockStr =
            ReadMocksHelper.readAuthMocksFile(LOGIN_MOCKS_DIR + filename)

        // WHEN
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(LOGIN_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding(StandardCharsets.UTF_8)
                .content(loginReqDtoMockStr)
        )
        // THEN
        val responseBodyStr =
            httpResponse.andExpect(status().isBadRequest).andReturn()
                .response.getContentAsString(StandardCharsets.UTF_8)
        assertNotNull(responseBodyStr)
        val responseErrMsg = extractJsonApiErrorMessage<String>(responseBodyStr)
            ?: fail("Response error message not found")
        assertEquals(expectedErrorMsg, responseErrMsg)
    }

    @Test
    fun `test logout with valid token successful should return http ok and revoke current token`() {
        val email = "pepe43223@gmail.com"
        val password = "xd123"
        createUserWithEmailAndPassword(email, password)
        val authSessionSaved1 = loginAndGetAuthSession(email, password)
        val anotherAuhSessionSaved = createNewAuthSessionWith(user = authSessionSaved1.user)

        // WHEN
        val tokenWithBearer = "$TOKEN_PREFIX${authSessionSaved1.token}"
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(LOGOUT_ENDPOINT)
                .header(HttpHeaders.AUTHORIZATION, tokenWithBearer)
        )
        // THEN
        httpResponse.andExpect(status().is2xxSuccessful)

        val allUserAuthSessions = authSessionRepo.findAllByUserId(authSessionSaved1.user.id)
        val postAuthSession1 = allUserAuthSessions.first { it.id == authSessionSaved1.id }
        assertEquals(authSessionSaved1.user.id, postAuthSession1.user.id)
        assertEquals(authSessionSaved1.id, postAuthSession1.id)
        assertTrue(postAuthSession1.revoked)
        assertFalse(authService.validateToken(tokenWithBearer, authSessionSaved1.user.id))

        val postAnotherAuthSessionSaved = allUserAuthSessions.first { it.id == anotherAuhSessionSaved.id }
        val anotherAuhSessionSavedTokenWithHeader = "$TOKEN_PREFIX${anotherAuhSessionSaved.token}"
        assertTrue(authService.validateToken(anotherAuhSessionSavedTokenWithHeader, authSessionSaved1.user.id))
        assertFalse(postAnotherAuthSessionSaved.revoked)
    }

    @ParameterizedTest
    @CsvSource(
        "invalid_token.txt",
        "valid_and_not_match_sign_key.txt",
        "valid_with_invalid_user_id.txt",
    )
    fun `test logout with invalid token should return http 401`(filename: String) {
        // WHEN
        val token = ReadMocksHelper.readJwtTokenMocksFile(filename)
        val tokenWithBearer = "$TOKEN_PREFIX${token}"
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(LOGOUT_ENDPOINT)
                .header(HttpHeaders.AUTHORIZATION, tokenWithBearer)
        )
        // THEN
        val responseBodyStr =
            httpResponse.andExpect(status().isUnauthorized).andReturn()
                .response.getContentAsString(StandardCharsets.UTF_8)
        assertNotNull(responseBodyStr)
        val responseErrMsg = extractJsonApiErrorMessage<String>(responseBodyStr)
            ?: fail("Response error message not found")
        assertEquals(InvalidTokenException().message, responseErrMsg)
    }

    @Test
    fun `test logout with invalid token Bearer prefix should return http 401`() {
        val email = "pepe23@gmail.com"
        val password = "xd123"
        createUserWithEmailAndPassword(email, password)
        val authSessionSaved = loginAndGetAuthSession(email, password)
        // WHEN
        val tokenWithBearer = authSessionSaved.token
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(LOGOUT_ENDPOINT)
                .header(HttpHeaders.AUTHORIZATION, tokenWithBearer)
        )
        // THEN
        val responseBodyStr =
            httpResponse.andExpect(status().isUnauthorized).andReturn()
                .response.getContentAsString(StandardCharsets.UTF_8)
        assertNotNull(responseBodyStr)
        val responseErrMsg = extractJsonApiErrorMessage<String>(responseBodyStr)
            ?: fail("Response error message not found")
        assertEquals(InvalidTokenException().message, responseErrMsg)
    }

    @Test
    fun `test logout all with valid token successful should return http ok and revoke all user tokens`() {
        val email = "pepe@gmail.com"
        val password = "xd123"
        createUserWithEmailAndPassword(email, password)
        val authSessionSaved1 = loginAndGetAuthSession(email, password)
        val anotherAuhSessionSaved = createNewAuthSessionWith(user = authSessionSaved1.user)

        // WHEN
        val tokenWithBearer = "$TOKEN_PREFIX${authSessionSaved1.token}"
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(LOGOUT_ALL_SESSIONS_ENDPOINT)
                .header(HttpHeaders.AUTHORIZATION, tokenWithBearer)
        )
        // THEN
        httpResponse.andExpect(status().is2xxSuccessful)
        val userAuthSessions = authSessionRepo.findAllByUserId(authSessionSaved1.user.id)

        assertEquals(2, userAuthSessions.size)
        assertTrue(userAuthSessions.all { it.revoked })
        assertTrue(userAuthSessions.any { it.id == authSessionSaved1.id })
        assertTrue(userAuthSessions.any { it.id == anotherAuhSessionSaved.id })
        userAuthSessions.forEach {
            assertFalse(authService.validateToken("$TOKEN_PREFIX${it.token}", authSessionSaved1.user.id))
        }
    }

    @ParameterizedTest
    @CsvSource(
        "invalid_token.txt",
        "valid_and_not_match_sign_key.txt",
        "valid_with_invalid_user_id.txt",
    )
    fun `test logout all with invalid token should return http 401`(filename: String) {
        // WHEN
        val token = ReadMocksHelper.readJwtTokenMocksFile(filename)
        val tokenWithBearer = "$TOKEN_PREFIX${token}"
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(LOGOUT_ALL_SESSIONS_ENDPOINT)
                .header(HttpHeaders.AUTHORIZATION, tokenWithBearer)
        )
        // THEN
        val responseBodyStr =
            httpResponse.andExpect(status().isUnauthorized).andReturn()
                .response.getContentAsString(StandardCharsets.UTF_8)
        assertNotNull(responseBodyStr)
        val responseErrMsg = extractJsonApiErrorMessage<String>(responseBodyStr)
            ?: fail("Response error message not found")
        assertEquals(InvalidTokenException().message, responseErrMsg)
    }

    @Test
    fun `test logout all with invalid token Bearer prefix should return http 401`() {
        val email = "pepe12323@gmail.com"
        val password = "xd123"
        createUserWithEmailAndPassword(email, password)
        val authSessionSaved = loginAndGetAuthSession(email, password)
        // WHEN
        val tokenWithBearer = authSessionSaved.token
        val httpResponse = mockMvc.perform(
            MockMvcRequestBuilders.post(LOGOUT_ALL_SESSIONS_ENDPOINT)
                .header(HttpHeaders.AUTHORIZATION, tokenWithBearer)
        )
        // THEN
        val responseBodyStr =
            httpResponse.andExpect(status().isUnauthorized).andReturn()
                .response.getContentAsString(StandardCharsets.UTF_8)
        assertNotNull(responseBodyStr)
        val responseErrMsg = extractJsonApiErrorMessage<String>(responseBodyStr)
            ?: fail("Response error message not found")
        assertEquals(InvalidTokenException().message, responseErrMsg)
    }

    private fun createUserWithEmailAndPassword(email: String, password: String) {
        val newUser = UserSampler.getWith(id = 0, email = email, password = password)
        userService.create(newUser)
    }

    private fun loginAndGetAuthSession(email: String, password: String): AuthSession {
        return authService.login(email, password)
    }

    private fun createNewAuthSessionWith(user: User): AuthSession {
        val issuedAt = getNowUTC()
        val expiredOn = issuedAt.plus(300, ChronoUnit.DAYS)
        val newJwtToken = jwtService.createToken(issuedAt, expiredOn, user)
        val newAuthSession = AuthSessionSampler.getWith(
            id = "",
            user = user,
            token = newJwtToken,
            revoked = false,
            createdOn = issuedAt,
            expiresOn = expiredOn,
        )
        return authSessionRepo.save(newAuthSession)
    }

    companion object {
        private const val REGISTER_MOCKS_DIR = "register/"
        private const val LOGIN_MOCKS_DIR = "login/"

        private const val AUTH_ENDPOINT = "/v1/auth"
        private const val REGISTER_ENDPOINT = "$AUTH_ENDPOINT/register"
        private const val LOGIN_ENDPOINT = "$AUTH_ENDPOINT/login"
        private const val LOGOUT_ENDPOINT = "$AUTH_ENDPOINT/logout"
        private const val LOGOUT_ALL_SESSIONS_ENDPOINT = "$AUTH_ENDPOINT/logout/all"
    }
}