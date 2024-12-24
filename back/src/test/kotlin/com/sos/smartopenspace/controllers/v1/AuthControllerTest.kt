package com.sos.smartopenspace.controllers.v1

import com.sos.smartopenspace.controllers.BaseControllerTest
import com.sos.smartopenspace.persistence.AuthSessionRepository
import com.sos.smartopenspace.persistence.UserRepository
import com.sos.smartopenspace.services.impl.JwtService
import com.sos.smartopenspace.testUtil.ReadMocksHelper
import com.sos.smartopenspace.testUtil.extractJsonApiErrorMessage
import com.sos.smartopenspace.testUtil.extractJsonPathValue
import com.sos.smartopenspace.util.getNowUTC
import jakarta.ws.rs.core.MediaType
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.nio.charset.StandardCharsets

class AuthControllerTest : BaseControllerTest() {

    @Autowired
    lateinit var userRepo: UserRepository

    @Autowired
    lateinit var authSessionRepo: AuthSessionRepository

    @Autowired
    lateinit var jwtService: JwtService

    @Test
    fun `register with register request dto should be http ok and return AuthResponseDto`() {
        val registerReqDtoMockFile = "valid_register_request_dto.json"
        val registerReqDtoMockStr =
            ReadMocksHelper.readAuthMocksFile(REGISTER_MOCKS_DIR + registerReqDtoMockFile)
        val userEmail = extractJsonPathValue<String>(registerReqDtoMockStr, "$.email")
            ?: fail("not email provided")

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
        val savedUser = userRepo.findByEmail(userEmail) ?: fail("User not found")
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
    fun `register with register request dto should be bad request`(
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

    companion object {
        private const val REGISTER_MOCKS_DIR = "register/"

        private const val AUTH_ENDPOINT = "/v1/auth"
        private const val REGISTER_ENDPOINT = "$AUTH_ENDPOINT/register"
    }
}