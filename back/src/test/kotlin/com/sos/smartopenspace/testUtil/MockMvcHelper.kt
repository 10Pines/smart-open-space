package com.sos.smartopenspace.testUtil

import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder


fun addQueryParamsIfNotNull(req: MockHttpServletRequestBuilder, queryParams: Map<String, String?>) =
    queryParams.entries.fold(req) { resReq, (name, value) ->
        addQueryParamIfNotNull(resReq, name, value)
    }

fun addQueryParamIfNotNull(
    req: MockHttpServletRequestBuilder,
    name: String,
    value: String?
): MockHttpServletRequestBuilder =
    value?.let { req.queryParam(name, value) } ?: req
