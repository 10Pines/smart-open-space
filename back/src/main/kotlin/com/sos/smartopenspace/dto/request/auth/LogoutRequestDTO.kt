package com.sos.smartopenspace.dto.request.auth

import com.sos.smartopenspace.util.toStringByReflex

data class LogoutRequestDTO(
    val token: String
) {
    override fun toString(): String =
        toStringByReflex(this, mask = listOf("token"))
}