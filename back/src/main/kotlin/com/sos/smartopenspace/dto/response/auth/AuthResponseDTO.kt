package com.sos.smartopenspace.dto.response.auth

import com.sos.smartopenspace.util.toStringByReflex

data class AuthResponseDTO(
    val token: String
) {
    override fun toString(): String =
        toStringByReflex(this, mask = listOf("token"))
}