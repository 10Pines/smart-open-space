package com.sos.smartopenspace.dto

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class DefaultErrorDtoTest {

    @Test
    fun testDefaultErrorDtoConstructor() {
        val message1 = "message"
        val statusCode1 = 200
        val status1 = "status_ok"

        val message2 = "message2"
        val statusCode2 = 404
        val status2 = "status_404"

        val defaultErrorDto1 = DefaultErrorDto(message1, statusCode1, status1)
        val defaultErrorDto2 = DefaultErrorDto(message2, statusCode2, status2, true)

        // Then
        assertEquals(message1, defaultErrorDto1.message)
        assertEquals(statusCode1, defaultErrorDto1.statusCode)
        assertEquals(status1, defaultErrorDto1.status)
        assertFalse(defaultErrorDto1.isFallbackError)

        assertEquals(message2, defaultErrorDto2.message)
        assertEquals(statusCode2, defaultErrorDto2.statusCode)
        assertEquals(status2, defaultErrorDto2.status)
        assertTrue(defaultErrorDto2.isFallbackError)
    }

    @Test
    fun `test DefaultErrorDto custom constructor with http status`() {
        val message1 = "success_ok"
        val httpStatus1 = HttpStatus.OK

        val message2 = "some_long_message".repeat(200)
        val httpStatus2 = HttpStatus.FORBIDDEN


        val defaultErrorDto1 = DefaultErrorDto(message1, httpStatus1)
        val defaultErrorDto2 = DefaultErrorDto(message2, httpStatus2, true)

        // THEN
        assertEquals(message1, defaultErrorDto1.message)
        assertEquals(httpStatus1.value(), defaultErrorDto1.statusCode)
        assertEquals(httpStatus1.name.lowercase(), defaultErrorDto1.status)
        assertFalse(defaultErrorDto1.isFallbackError)

        assertEquals(message2.take(250), defaultErrorDto2.message)
        assertEquals(httpStatus2.value(), defaultErrorDto2.statusCode)
        assertEquals(httpStatus2.name.lowercase(), defaultErrorDto2.status)
        assertTrue(defaultErrorDto2.isFallbackError)
    }

}