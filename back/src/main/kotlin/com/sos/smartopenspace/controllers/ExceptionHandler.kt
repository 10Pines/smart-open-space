package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.domain.BadRequestException
import com.sos.smartopenspace.domain.ForbiddenException
import com.sos.smartopenspace.domain.NotFoundException
import com.sos.smartopenspace.domain.UnauthorizedException
import com.sos.smartopenspace.domain.UnprocessableEntityException
import com.sos.smartopenspace.dto.DefaultErrorDto
import com.sos.smartopenspace.metrics.API_ERROR_CONTEXT_FIELD
import com.sos.smartopenspace.metrics.ObservationMetricHelper
import io.github.resilience4j.ratelimiter.RequestNotPermitted
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.ConstraintViolationException
import org.slf4j.LoggerFactory
import org.springframework.beans.TypeMismatchException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.BindException
import org.springframework.web.HttpMediaTypeNotAcceptableException
import org.springframework.web.HttpMediaTypeNotSupportedException
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.MissingPathVariableException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.ServletRequestBindingException
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

  @ExceptionHandler(
    BadRequestException::class,
    HttpMessageNotReadableException::class,
    HttpMediaTypeNotSupportedException::class,
    HttpMediaTypeNotAcceptableException::class,
    MissingServletRequestParameterException::class,
    MissingPathVariableException::class,
    ServletRequestBindingException::class,
    ConstraintViolationException::class,
    TypeMismatchException::class,
    BindException::class
  )
  fun badRequestHandler(
    request: HttpServletRequest,
    ex: Exception
  ): ResponseEntity<DefaultErrorDto> {
    val httpStatus = HttpStatus.BAD_REQUEST
    handleLogErrorOfCaughtEx(request, httpStatus, ex, false)

    val errorDto = DefaultErrorDto(ex.message, httpStatus)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, httpStatus)
  }

  @ExceptionHandler(MethodArgumentNotValidException::class)
  fun badRequestValidations(
    request: HttpServletRequest,
    ex: MethodArgumentNotValidException
  ): ResponseEntity<DefaultErrorDto> {
    val httpStatus = HttpStatus.BAD_REQUEST
    handleLogErrorOfCaughtEx(request, httpStatus, ex, false)
    val errors = ex.bindingResult.allErrors.mapNotNull { it.defaultMessage }
    val errorMsg = errors.getOrNull(0) ?: DEFAULT_VALIDATION_ERROR

    val errorDto = DefaultErrorDto(errorMsg, httpStatus)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, httpStatus)
  }

  @ExceptionHandler(UnprocessableEntityException::class)
  fun unprocessableEntityHandler(
    request: HttpServletRequest,
    ex: Exception
  ): ResponseEntity<DefaultErrorDto> {
    val httpStatus = HttpStatus.UNPROCESSABLE_ENTITY
    handleLogErrorOfCaughtEx(request, httpStatus, ex, false)

    val errorDto = DefaultErrorDto(ex.message, httpStatus)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, httpStatus)
  }

  @ExceptionHandler(NotFoundException::class)
  fun notFoundHandler(
    request: HttpServletRequest,
    ex: Exception
  ): ResponseEntity<DefaultErrorDto> {
    val httpStatus = HttpStatus.NOT_FOUND
    handleLogErrorOfCaughtEx(request, httpStatus, ex, false)

    val errorDto = DefaultErrorDto(ex.message, httpStatus)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, httpStatus)
  }

  @ExceptionHandler(UnauthorizedException::class)
  fun notAuthHandler(
    request: HttpServletRequest,
    ex: Exception
  ): ResponseEntity<DefaultErrorDto> {
    val httpStatus = HttpStatus.UNAUTHORIZED
    handleLogErrorOfCaughtEx(request, httpStatus, ex)

    val errorDto = DefaultErrorDto(ex.message, httpStatus)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, httpStatus)
  }

  @ExceptionHandler(ForbiddenException::class)
  fun forbiddenHandler(
    request: HttpServletRequest,
    ex: Exception
  ): ResponseEntity<DefaultErrorDto> {
    val httpStatus = HttpStatus.FORBIDDEN
    handleLogErrorOfCaughtEx(request, httpStatus, ex)

    val errorDto = DefaultErrorDto(ex.message, httpStatus)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, httpStatus)
  }

  @ExceptionHandler(NoResourceFoundException::class)
  fun endpointNotFoundHandler(
    request: HttpServletRequest,
    ex: Exception
  ): ResponseEntity<DefaultErrorDto> {
    val httpStatus = HttpStatus.NOT_FOUND
    handleLogErrorOfCaughtEx(request, httpStatus, ex)

    val errorDto = DefaultErrorDto(ex.message, httpStatus)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, httpStatus)
  }

  @ExceptionHandler(HttpRequestMethodNotSupportedException::class)
  fun methodNotAllowedHandler(
    request: HttpServletRequest,
    ex: Exception
  ): ResponseEntity<DefaultErrorDto> {
    val httpStatus = HttpStatus.METHOD_NOT_ALLOWED
    handleLogErrorOfCaughtEx(request, httpStatus, ex)

    val errorDto = DefaultErrorDto(ex.message, httpStatus)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, httpStatus)
  }

  @ExceptionHandler(RequestNotPermitted::class)
  fun handleRateLimiterException(
    request: HttpServletRequest,
    ex: RequestNotPermitted
  ): ResponseEntity<DefaultErrorDto> {
    val httpStatus = HttpStatus.TOO_MANY_REQUESTS
    handleLogErrorOfCaughtEx(request, httpStatus, ex, false)

    val errorDto = DefaultErrorDto("rate_limiter_too_many_request", httpStatus)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, httpStatus)
  }

  @ExceptionHandler(Exception::class)
  fun fallbackExceptionHandler(
    request: HttpServletRequest,
    ex: Exception
  ): ResponseEntity<DefaultErrorDto> {
    val resStatus = HttpStatus.INTERNAL_SERVER_ERROR
    val errorDto = DefaultErrorDto(ex.message, resStatus, true)
    val errMsg = buildLogError(
      "Handling fallback uncaught exception",
      request,
      resStatus,
      ex
    )
    LOGGER.error(errMsg, ex)
    observeError(request, errorDto)
    return ResponseEntity(errorDto, resStatus)
  }

  private fun handleLogErrorOfCaughtEx(
    request: HttpServletRequest,
    status: HttpStatus,
    ex: Exception,
    withStackTrace: Boolean = true
  ) {
    val errMsg = buildLogError("Handling caught exception", request, status, ex)
    if (withStackTrace) {
      LOGGER.error(errMsg, ex)
    } else {
      LOGGER.error(errMsg)
    }
  }

  private fun buildLogError(
    msg: String,
    request: HttpServletRequest,
    status: HttpStatus,
    ex: Exception
  ): String =
    "$msg [http status=${status.name}][exception_class_name=${ex.javaClass.simpleName}]" +
      "[exception_message=${ex.message}][request_method=${request.method}]" +
      "[request_uri=${request.requestURI}]"

  private fun observeError(
    request: HttpServletRequest,
    errorDto: DefaultErrorDto
  ) {
    observationMetricHelper.addContext(
      request,
      API_ERROR_CONTEXT_FIELD,
      errorDto
    )
  }

}
