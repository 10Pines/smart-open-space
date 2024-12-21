package com.sos.smartopenspace.persistence

import com.sos.smartopenspace.domain.AuthSession
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.Instant

interface AuthSessionRepository: JpaRepository<AuthSession, String> {

    @Query("SELECT a FROM AuthSession a WHERE a.user.id = :userId AND a.revoked = false AND a.token = :token AND a.expiresOn > :expiredFrom")
    fun findByTokenAndUserIdAndNotRevokedAndNotExpiredFrom(token: String, userId: Long, expiredFrom: Instant): AuthSession?

    @Query("SELECT a FROM AuthSession a WHERE a.user.id = :userId AND a.revoked = false AND a.expiresOn > :expiredFrom")
    fun findAllByUserIdAndNotRevokedAndNotExpiredFrom(userId: Long, expiredFrom: Instant): List<AuthSession>
}