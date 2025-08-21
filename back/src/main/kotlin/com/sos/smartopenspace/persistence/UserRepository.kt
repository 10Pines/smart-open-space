package com.sos.smartopenspace.persistence

import com.sos.smartopenspace.domain.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long> {

  fun findByEmailAndPassword(email: String, password: String): User?

  fun findByEmailAndResetToken(email: String, resetToken: String): User?

  fun findByEmail(email: String): User?
}
