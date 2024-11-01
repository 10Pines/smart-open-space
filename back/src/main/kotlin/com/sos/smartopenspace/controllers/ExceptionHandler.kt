package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.domain.BadRequestException
import com.sos.smartopenspace.domain.NotFoundException
import com.sos.smartopenspace.domain.UnauthorizedException
import com.sos.smartopenspace.domain.UnprocessableEntityException
import com.sos.smartopenspace.dto.DefaultErrorDto
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.resource.NoResourceFoundException

@ControllerAdvice
class ExceptionHandler {

    companion object {
        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }

    @ExceptionHandler(BadRequestException::class)
    fun badRequestHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.BAD_REQUEST
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus.name), httpStatus)
    }

    @ExceptionHandler(UnprocessableEntityException::class)
    fun unprocessableEntityHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.UNPROCESSABLE_ENTITY
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus.name), httpStatus)
    }

    @ExceptionHandler(NotFoundException::class)
    fun notFoundHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.NOT_FOUND
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus.name), httpStatus)
    }

    @ExceptionHandler(UnauthorizedException::class)
    fun notAuthHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.UNAUTHORIZED
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus.name), httpStatus)
    }

    @ExceptionHandler(NoResourceFoundException::class)
    fun endpointNotFoundHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.NOT_FOUND
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus.name), httpStatus)
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException::class)
    fun methodNotAllowedHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.METHOD_NOT_ALLOWED
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus.name), httpStatus)
    }

    @ExceptionHandler(Exception::class)
    fun fallbackExceptionHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
        handleLogError(httpStatus, ex)
        //TODO: Add custom metrics
        throw ex
    }

    private fun handleLogError(status: HttpStatus, ex: Exception) {
        LOGGER.error(
            "Handling http status ${status.name} with exception ${ex.javaClass} and message: ${ex.message}",
            ex
        )
    }
}
