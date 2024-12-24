package com.sos.smartopenspace.testUtil

import com.jayway.jsonpath.JsonPath

private const val JSON_PATH_ERROR_MESSAGE = "$.message"

fun <T> extractJsonPathValue(jsonStr: String, jsonPath: String): T? =
    JsonPath.read(jsonStr, jsonPath)

fun <T> extractJsonApiErrorMessage(jsonStr: String): T? =
    JsonPath.read(jsonStr, JSON_PATH_ERROR_MESSAGE)