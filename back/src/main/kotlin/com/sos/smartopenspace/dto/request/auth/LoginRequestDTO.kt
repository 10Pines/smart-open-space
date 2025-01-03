package com.sos.smartopenspace.dto.request.auth

import com.sos.smartopenspace.dto.request.auth.RegisterRequestDTO.Companion.PASSWORD_MAX_LENGTH
import com.sos.smartopenspace.util.toStringByReflex
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size

data class LoginRequestDTO(
    @field:NotEmpty(message = "Ingrese un email válido")
    @field:Email(message = "Ingrese un email válido")
    val email: String,
    @field:NotBlank(message = "Ingrese una contraseña")
    @field:Size(max = PASSWORD_MAX_LENGTH, message = "Contraseña muy larga")
    val password: String
) {
    override fun toString(): String =
        toStringByReflex(this, mask = listOf("password"))
}
