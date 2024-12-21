package com.sos.smartopenspace.dto.request.auth

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import org.hibernate.validator.constraints.Length

data class RegisterRequestDTO(
    @field:NotEmpty(message = "Ingrese un email")
    @field:Email
    @field:Length(max = 150, message = "El email debe tener max 150 caracteres")
    val email: String,
    @field:NotEmpty(message = "Ingrese una contraseña")
    @field:NotBlank(message = "Contraseña no puede ser vacía")
    @field:Length(min= 4, max = 50, message = "La contraseña debe tener al menos entre 4 a 50 caracteres")
    var password: String = "",
    @field:NotEmpty(message = "Ingrese un nombre")
    @field:NotBlank(message = "Nombre no puede ser vacío")
    @field:Length(min= 1, max = 150, message = "El nombre debe tener al menos entre 1 a 150 caracteres")
    val name: String,
) {
}