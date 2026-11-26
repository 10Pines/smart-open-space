package com.sos.smartopenspace.services

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class PasswordEncoderService(
  private val passwordEncoder: PasswordEncoder,
) {

  fun encodePassword(password: String): String {
    return requireNotNull(passwordEncoder.encode(password)) { "El encoder devolvió una contraseña nula" }
  }

  fun matchesPassword(password: String, encodedPassword: String): Boolean {
    return passwordEncoder.matches(password, encodedPassword)
  }
}
