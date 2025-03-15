package com.sos.smartopenspace.aspect.metrics

import com.sos.smartopenspace.domain.BadRequestException
import com.sos.smartopenspace.metrics.*
import io.micrometer.common.KeyValues
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.AfterThrowing
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component

@Aspect
@Component
class UserMetricAspects(
    val observationMetricHelper: ObservationMetricHelper
) {

    @Around("@annotation(com.sos.smartopenspace.aspect.metrics.UserRegisterMetric)")
    fun observeAroundUserRegisterMetric(joinPoint: ProceedingJoinPoint): Any? {
        //TODO: could add custom tags from joinPoint
        val defaultEmptyTags = KeyValues.of(
            TAG_ERROR_NAME, TAG_EMPTY_VALUE,
            TAG_ERROR_CODE, TAG_EMPTY_VALUE,
            TAG_ERROR_MESSAGE, TAG_EMPTY_VALUE,
        )
        return observationMetricHelper.observeBusinessChecked<Any, Throwable>(
            USER_REGISTER_METRIC,
            defaultEmptyTags,
            joinPoint::proceed
        )
    }

    @AfterThrowing(
        value = "@annotation(com.sos.smartopenspace.aspect.metrics.UserRegisterMetric)",
        throwing = "ex"
    )
    fun observeAfterThrowingUserRegisterMetric(ex: Exception) {
        val tags = mutableMapOf(
            TAG_ERROR_NAME to TAG_EMPTY_VALUE,
            TAG_ERROR_CODE to TAG_EMPTY_VALUE,
            TAG_ERROR_MESSAGE to TAG_EMPTY_VALUE,
        )
        when (ex) {
            is BadRequestException -> {
                tags[TAG_ERROR_NAME] = "invalid_client_request"
                tags[TAG_ERROR_CODE] = HttpStatus.BAD_REQUEST.value().toString()
                tags[TAG_ERROR_MESSAGE] = getAtMaxWidthOrEmptyValueIfBlankOrNull(ex.message)
            }
        }
        observationMetricHelper.addMetricTags(tags.toMap())
    }
}