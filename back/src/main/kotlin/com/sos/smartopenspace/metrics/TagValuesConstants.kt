package com.sos.smartopenspace.metrics

// Tag keys
const val TAG_REQUEST_CONTAINS_JWT = "request_with_jwt"


const val TAG_EX_CLASSNAME = "exception_classname"
const val TAG_ERROR_NAME = "error_name"
const val TAG_ERROR_CODE = "error_code"
const val TAG_ERROR_MESSAGE = "error_message"
const val TAG_IS_FALLBACK_ERROR = "is_fallback_error"


// Tag values
const val MAX_VALUE_MESSAGE_WIDTH = 30
const val TAG_EMPTY_VALUE = "none"
const val TAG_UNKNOWN_VALUE = "unknown"

const val TAG_INVALID_CLIENT_REQ_VALUE = "invalid_client_request"

/**
 * Get the value of the tag at most MAX_VALUE_MESSAGE_WIDTH characters long or
 * return TAG_EMPTY_VALUE if the value is blank or null. Also, change spaces to underscores.
 */
fun getAtMaxWidthOrEmptyValueIfBlankOrNull(tagValue: String?): String =
  tagValue?.let { getAtMaxWidthOrEmptyValueIfBlank(it) }
    ?: TAG_EMPTY_VALUE

/**
 * Get the value of the tag at most MAX_VALUE_MESSAGE_WIDTH characters long, replace
 * spaces to underscores and lowercase the value. If the value is blank, return TAG_EMPTY_VALUE.
 */
fun getAtMaxWidthOrEmptyValueIfBlank(tagValue: String): String {
  val tagValueShort = tagValue.take(MAX_VALUE_MESSAGE_WIDTH)
    .lowercase()
  return tagValueShort
    .ifBlank { TAG_EMPTY_VALUE }
    .replace(' ', '_')
}
