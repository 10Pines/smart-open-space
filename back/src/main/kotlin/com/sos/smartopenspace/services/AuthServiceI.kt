package com.sos.smartopenspace.services

import com.sos.smartopenspace.domain.AuthSession
import com.sos.smartopenspace.domain.User
import java.time.Instant

interface AuthServiceI {

    fun register(newUser: User): AuthSession

    fun login(email: String, password: String): AuthSession

    fun logout(tokenHeader: String)

    fun logoutAllSessions(tokenHeader: String)

    fun validateToken(tokenHeader: String, userId: Long): Boolean

    fun purgeInvalidSessions(creationDateFrom: Instant, creationDateTo: Instant): Int
}