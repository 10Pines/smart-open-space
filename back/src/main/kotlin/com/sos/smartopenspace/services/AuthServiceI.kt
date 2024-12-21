package com.sos.smartopenspace.services

import com.sos.smartopenspace.domain.AuthSession
import com.sos.smartopenspace.domain.User

interface AuthServiceI {

    fun register(newUser: User): AuthSession

    fun login(email: String, password: String): AuthSession

    fun logout(tokenHeader: String)

    fun logoutAllSessions(tokenHeader: String)

    fun validateToken(tokenHeader: String, userId: Long): Boolean
}