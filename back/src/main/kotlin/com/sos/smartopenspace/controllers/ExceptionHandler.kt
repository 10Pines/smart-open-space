package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.domain.*
import com.sos.smartopenspace.dto.DefaultErrorDto
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.resource.NoResourceFoundException

@ControllerAdvice
class ExceptionHandler {

    companion object {
        private const val DEFAULT_VALIDATION_ERROR = "Hay un campo invalido"

        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }

    @ExceptionHandler(BadRequestException::class)
    fun badRequestHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.BAD_REQUEST
        handleLogError(httpStatus, ex, false)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus), httpStatus)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun badRequestValidations(ex: MethodArgumentNotValidException): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.BAD_REQUEST
        handleLogError(httpStatus, ex, false)
        val errors = ex.bindingResult.allErrors.mapNotNull { it.defaultMessage }
        val errorMsg = errors.getOrNull(0) ?: DEFAULT_VALIDATION_ERROR
        return ResponseEntity(DefaultErrorDto(errorMsg, httpStatus), httpStatus)
    }

    @ExceptionHandler(UnprocessableEntityException::class)
    fun unprocessableEntityHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.UNPROCESSABLE_ENTITY
        handleLogError(httpStatus, ex, false)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus), httpStatus)
    }

    @ExceptionHandler(NotFoundException::class)
    fun notFoundHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.NOT_FOUND
        handleLogError(httpStatus, ex, false)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus), httpStatus)
    }

    @ExceptionHandler(UnauthorizedException::class)
    fun notAuthHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.UNAUTHORIZED
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus), httpStatus)
    }

    @ExceptionHandler(ForbiddenException::class)
    fun forbiddenHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.FORBIDDEN
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus), httpStatus)
    }

    @ExceptionHandler(NoResourceFoundException::class)
    fun endpointNotFoundHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.NOT_FOUND
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus), httpStatus)
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException::class)
    fun methodNotAllowedHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.METHOD_NOT_ALLOWED
        handleLogError(httpStatus, ex)
        return ResponseEntity(DefaultErrorDto(ex.message, httpStatus), httpStatus)
    }

    @ExceptionHandler(Exception::class)
    fun fallbackExceptionHandler(ex: Exception): ResponseEntity<DefaultErrorDto> {
        LOGGER.error("Handling fallback uncaught exception ${ex.javaClass} and [message=${ex.message}].")
        //TODO: Add custom metrics
        throw ex
    }

    private fun handleLogError(status: HttpStatus, ex: Exception, withStackTrace: Boolean = true) {
        val errMsg =
            "Handling http status ${status.name} with exception ${ex.javaClass} and message: ${ex.message}."
        if (withStackTrace) {
            LOGGER.error(errMsg, ex)
        } else {
            LOGGER.error(errMsg)
        }
    }
}
