package com.sos.smartopenspace.services

import com.sos.smartopenspace.domain.AuthSession
import com.sos.smartopenspace.domain.User
import java.time.Instant

interface AuthServiceI {

    fun register(newUser: User): AuthSession

    fun login(email: String, password: String): AuthSession

    /**
     * @return the user id that was logged out.
     */
    fun logout(tokenHeader: String): Long

    /**
     * @return the user id that was logged out.
     */
    fun logoutAllSessions(tokenHeader: String): Long

    /**
     * @return true if the token is valid (signed and not expired) and match token payload user_id with param user_id.
     */
    fun validateToken(tokenHeader: String, userId: Long): Boolean

    /**
     * @return size of invalid sessions deleted.
     */
    fun purgeInvalidSessions(creationDateFrom: Instant, creationDateTo: Instant): Int

    fun tokenBelongsToUser(tokenHeader: String, userId: Long): Boolean
}