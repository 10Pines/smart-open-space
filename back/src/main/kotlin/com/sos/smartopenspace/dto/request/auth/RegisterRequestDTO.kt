package com.sos.smartopenspace.dto.request.auth

import com.sos.smartopenspace.util.toStringByReflex
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size

data class RegisterRequestDTO(
    @field:NotEmpty(message = "Ingrese un email")
    @field:Email
    @field:Size(max = 150, message = "El email debe tener max 150 caracteres")
    val email: String,
    @field:NotEmpty(message = "Ingrese una contraseña")
    @field:NotBlank(message = "Contraseña no puede ser vacía")
    @field:Size(min= 4, max = 50, message = "La contraseña debe tener al menos entre 4 a 50 caracteres")
    var password: String = "",
    @field:NotEmpty(message = "Ingrese un nombre")
    @field:NotBlank(message = "Nombre no puede ser vacío")
    @field:Size(min= 1, max = 150, message = "El nombre debe tener al menos entre 1 a 150 caracteres")
    val name: String,
) {
    override fun toString(): String =
        toStringByReflex(this, mask = listOf("password"))
}