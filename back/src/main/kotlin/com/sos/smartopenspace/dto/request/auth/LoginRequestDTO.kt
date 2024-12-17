package com.sos.smartopenspace.dto.request.auth

import com.sos.smartopenspace.util.toStringByReflex
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size

data class LoginRequestDTO(
    @field:NotEmpty(message = "Ingrese un email")
    @field:Email
    val email: String,
    @field:NotEmpty(message = "Ingrese una contraseña")
    @field:NotBlank(message = "Contraseña no puede ser vacía")
    @field:Size(max = 200, message = "Contraseña muy larga")
    val password: String
) {
    override fun toString(): String =
        toStringByReflex(this, mask = listOf("password"))
}
