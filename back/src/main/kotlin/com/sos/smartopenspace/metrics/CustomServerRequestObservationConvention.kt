package com.sos.smartopenspace.metrics

import com.sos.smartopenspace.dto.DefaultErrorDto
import com.sos.smartopenspace.services.impl.JwtService.Companion.TOKEN_PREFIX
import io.micrometer.common.KeyValues
import jakarta.servlet.http.HttpServletRequest
import jakarta.ws.rs.core.HttpHeaders
import org.springframework.http.server.observation.DefaultServerRequestObservationConvention
import org.springframework.http.server.observation.ServerRequestObservationContext

class CustomServerRequestObservationConvention :
    DefaultServerRequestObservationConvention(BASE_METRIC) {


    override fun getLowCardinalityKeyValues(context: ServerRequestObservationContext): KeyValues =
        super.getLowCardinalityKeyValues(context)
            .and(getRequestKeyValues(context))


    private fun getRequestKeyValues(context: ServerRequestObservationContext): KeyValues {
        val request = context.carrier
        val isRequestWithJwt = isRequestWithToken(request)
        var keyValues = KeyValues.of(
            TAG_REQUEST_CONTAINS_JWT, isRequestWithJwt.toString()
        )

        when (val apiError: Any? = context.get(API_ERROR_CONTEXT_FIELD)) {
            is DefaultErrorDto ->
                keyValues = keyValues.and(
                    TAG_IS_FALLBACK_ERROR, apiError.isFallbackError.toString(),
                    TAG_ERROR_CODE, apiError.statusCode.toString(),
                    TAG_ERROR_NAME, getAtMaxWidthOrEmptyValueIfBlank(apiError.status),
                    TAG_ERROR_MESSAGE, getAtMaxWidthOrEmptyValueIfBlankOrNull(apiError.message),
                )
        }
        return keyValues
    }

    private fun isRequestWithToken(request: HttpServletRequest): Boolean =
        request.getHeader(HttpHeaders.AUTHORIZATION)?.let {
            it.contains(TOKEN_PREFIX) && it.length > TOKEN_PREFIX.length + 1
        } ?: false


}