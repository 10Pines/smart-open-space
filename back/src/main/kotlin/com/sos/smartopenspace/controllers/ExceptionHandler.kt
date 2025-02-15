package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.domain.*
import com.sos.smartopenspace.dto.DefaultErrorDto
import com.sos.smartopenspace.metrics.API_ERROR_CONTEXT_FIELD
import com.sos.smartopenspace.metrics.ObservationMetricHelper
import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.resource.NoResourceFoundException

@ControllerAdvice
class ExceptionHandler(
    val observationMetricHelper: ObservationMetricHelper,
) {

    companion object {
        private const val DEFAULT_VALIDATION_ERROR = "Hay un campo invalido"

        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }

    @ExceptionHandler(BadRequestException::class)
    fun badRequestHandler(request: HttpServletRequest, ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.BAD_REQUEST
        handleLogError(httpStatus, ex, false)

        val errorDto = DefaultErrorDto(ex.message, httpStatus)
        observeError(request, errorDto)
        return ResponseEntity(errorDto, httpStatus)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun badRequestValidations(request: HttpServletRequest, ex: MethodArgumentNotValidException): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.BAD_REQUEST
        handleLogError(httpStatus, ex, false)
        val errors = ex.bindingResult.allErrors.mapNotNull { it.defaultMessage }
        val errorMsg = errors.getOrNull(0) ?: DEFAULT_VALIDATION_ERROR

        val errorDto = DefaultErrorDto(errorMsg, httpStatus)
        observeError(request, errorDto)
        return ResponseEntity(errorDto, httpStatus)
    }

    @ExceptionHandler(UnprocessableEntityException::class)
    fun unprocessableEntityHandler(request: HttpServletRequest, ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.UNPROCESSABLE_ENTITY
        handleLogError(httpStatus, ex, false)

        val errorDto = DefaultErrorDto(ex.message, httpStatus)
        observeError(request, errorDto)
        return ResponseEntity(errorDto, httpStatus)
    }

    @ExceptionHandler(NotFoundException::class)
    fun notFoundHandler(request: HttpServletRequest, ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.NOT_FOUND
        handleLogError(httpStatus, ex, false)

        val errorDto = DefaultErrorDto(ex.message, httpStatus)
        observeError(request, errorDto)
        return ResponseEntity(errorDto, httpStatus)
    }

    @ExceptionHandler(UnauthorizedException::class)
    fun notAuthHandler(request: HttpServletRequest, ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.UNAUTHORIZED
        handleLogError(httpStatus, ex)

        val errorDto = DefaultErrorDto(ex.message, httpStatus)
        observeError(request, errorDto)
        return ResponseEntity(errorDto, httpStatus)
    }

    @ExceptionHandler(ForbiddenException::class)
    fun forbiddenHandler(request: HttpServletRequest, ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.FORBIDDEN
        handleLogError(httpStatus, ex)

        val errorDto = DefaultErrorDto(ex.message, httpStatus)
        observeError(request, errorDto)
        return ResponseEntity(errorDto, httpStatus)
    }

    @ExceptionHandler(NoResourceFoundException::class)
    fun endpointNotFoundHandler(request: HttpServletRequest, ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.NOT_FOUND
        handleLogError(httpStatus, ex)

        val errorDto = DefaultErrorDto(ex.message, httpStatus)
        observeError(request, errorDto)
        return ResponseEntity(errorDto, httpStatus)
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException::class)
    fun methodNotAllowedHandler(request: HttpServletRequest, ex: Exception): ResponseEntity<DefaultErrorDto> {
        val httpStatus = HttpStatus.METHOD_NOT_ALLOWED
        handleLogError(httpStatus, ex)

        val errorDto = DefaultErrorDto(ex.message, httpStatus)
        observeError(request, errorDto)
        return ResponseEntity(errorDto, httpStatus)
    }

    @ExceptionHandler(Exception::class)
    fun fallbackExceptionHandler(request: HttpServletRequest, ex: Exception): ResponseEntity<DefaultErrorDto> {
        val errorDto = DefaultErrorDto(ex.message, HttpStatus.INTERNAL_SERVER_ERROR, true)
        LOGGER.error("Handling fallback uncaught exception ${ex.javaClass} , [message=${ex.message}] and [error_dto=$errorDto]")
        observeError(request, errorDto)
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

    private fun observeError(request: HttpServletRequest, errorDto: DefaultErrorDto) {
        observationMetricHelper.addContext(request, API_ERROR_CONTEXT_FIELD, errorDto)
    }

}
