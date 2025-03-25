package com.sos.smartopenspace.dto

import org.springframework.http.HttpStatus

data class DefaultErrorDto(
    val message: String?,
    val statusCode: Int,
    val status: String,
    val isFallbackError: Boolean = false
) {
    constructor(message: String?, httpStatus: HttpStatus, isFallbackError: Boolean = false) :
            this(
                message?.take(MAX_SIZE_MESSAGE) ?: DEFAULT_MESSAGE,
                httpStatus.value(),
                httpStatus.name.lowercase(),
                isFallbackError
            )

    companion object {
        private const val DEFAULT_MESSAGE = "unexpected error"
        private const val MAX_SIZE_MESSAGE = 250
    }
}