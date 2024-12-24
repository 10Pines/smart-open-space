package com.sos.smartopenspace.services.impl


import com.sos.smartopenspace.domain.AuthSession
import com.sos.smartopenspace.domain.InvalidTokenException
import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.persistence.AuthSessionRepository
import com.sos.smartopenspace.services.AuthServiceI
import com.sos.smartopenspace.services.UserService
import com.sos.smartopenspace.util.getNowUTC
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.temporal.ChronoUnit

@Service
class AuthService(
    @Value("\${jwt.expirationInMinutes}")
    private val expirationInMin: Long,
    private val authSessionRepository: AuthSessionRepository,
    private val userService: UserService,
    private val jwtService: JwtService,
) : AuthServiceI {

    @Transactional
    override fun register(newUser: User): AuthSession {
        val userCreated = userService.create(newUser)
        return createAuthSession(userCreated)
    }

    @Transactional
    override fun login(email: String, password: String): AuthSession {
        val user = userService.findUserAndMatchPassword(email, password)
        return createAuthSession(user)
    }

    override fun logout(tokenHeader: String) {
        val token = jwtService.extractToken(tokenHeader)
        val userId = jwtService.extractUserId(token)
        val authSession = authSessionRepository
            .findByTokenAndUserIdAndNotRevokedAndNotExpiredFrom(token, userId, getNowUTC())
        authSession?.let {
            authSession.revoke()
            authSessionRepository.save(authSession)
        }
    }

    override fun logoutAllSessions(tokenHeader: String) {
        val token = jwtService.extractToken(tokenHeader)
        val userId = jwtService.extractUserId(token)
        val authSessions = authSessionRepository
            .findAllByUserIdAndNotRevokedAndNotExpiredFrom(userId, getNowUTC())
        if (authSessions.isNotEmpty()) {
            authSessions.forEach { it.revoke() }
            authSessionRepository.saveAll(authSessions)
        }
    }

    override fun validateToken(tokenHeader: String, userId: Long): Boolean {
        val now = getNowUTC()
        val token = jwtService.extractToken(tokenHeader)
        val expiredTokenResWithLoggerFn = { tokenUserId: Long ->
            LOGGER.error("Current jwt token was expired or revoked with userId $userId, tokenUserId $tokenUserId and date_now $now")
            false
        }
        return jwtService.isValidToken(token) && jwtService.extractUserId(token)
            .let { tokenUserId ->
                if (tokenUserId != userId) {
                    return expiredTokenResWithLoggerFn(tokenUserId)
                }
                return authSessionRepository
                    .findByTokenAndUserIdAndNotRevokedAndNotExpiredFrom(token, tokenUserId, now)
                    ?.let {
                        true
                    } ?: expiredTokenResWithLoggerFn(tokenUserId)
            }
    }


    private fun createAuthSession(user: User): AuthSession {
        val now = getNowUTC()
        val expirationAt = now.plus(expirationInMin, ChronoUnit.MINUTES)

        val authSession = AuthSession(
            token = jwtService.createToken(now, expirationAt, user),
            createdOn = now,
            expiresOn = expirationAt,
            revoked = false,
            user = user,
        )
        return authSessionRepository.save(authSession)
    }

    companion object {
        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }
}