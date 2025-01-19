package com.sos.smartopenspace.dto.request.auth

import jakarta.validation.constraints.NotBlank

data class PurgePasswordDTO(
    @field:NotBlank(message = "password should not be null or empty") val purgePassword: String
) {
}