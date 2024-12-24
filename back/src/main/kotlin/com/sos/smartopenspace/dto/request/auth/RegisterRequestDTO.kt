package com.sos.smartopenspace.dto.request.auth

import com.sos.smartopenspace.util.toStringByReflex
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterRequestDTO(
    @field:NotBlank(message = "Ingrese un email válido")
    @field:Email(message = "Ingrese un email válido")
    val email: String,
    @field:NotBlank(message = "La contraseña debe tener al menos entre 4 a 150 caracteres")
    @field:Size(min= 4, max = 150, message = "La contraseña debe tener al menos entre 4 a 150 caracteres")
    val password: String,
    @field:NotBlank(message = "Ingrese un nombre")
    @field:Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
    val name: String,
) {
    override fun toString(): String =
        toStringByReflex(this, mask = listOf("password"))
}