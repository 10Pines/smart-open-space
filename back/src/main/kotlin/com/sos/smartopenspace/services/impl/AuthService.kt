package com.sos.smartopenspace.services.impl


import com.sos.smartopenspace.domain.AuthSession
import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.persistence.AuthSessionRepository
import com.sos.smartopenspace.services.AuthServiceI
import com.sos.smartopenspace.services.UserService
import com.sos.smartopenspace.util.getNowUTC
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
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
        val isValidToken = jwtService.isValidToken(token)
        if (!isValidToken) {
            LOGGER.error("Current jwt token is invalid with userId $userId and date_now $now")
            return false
        }
        val userIdFromToken = jwtService.extractUserId(token)
        if (userIdFromToken != userId) {
            LOGGER.error("Jwt token user not match with userId $userId, tokenUserId $userIdFromToken and date_now $now")
            return false
        }
        val existValidTokenSaved = authSessionRepository
            .findByTokenAndUserIdAndNotRevokedAndNotExpiredFrom(token, userIdFromToken, now).let { it != null }
        if (!existValidTokenSaved) {
            LOGGER.error("Current jwt token was expired or revoked with userId $userId, tokenUserId $userIdFromToken and date_now $now")
            return false
        }
        return true
    }

    @Transactional
    override fun purgeInvalidSessions(creationDateFrom: Instant, creationDateTo: Instant): Int {
        val now = getNowUTC()
        return authSessionRepository.deleteAllSessionsExpiresOnBeforeAndBetweenCreationOn(now, creationDateFrom, creationDateTo)
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
        LOGGER.debug(
            "Creating auth session {} with token length {}",
            authSession,
            authSession.token.length
        )
        return authSessionRepository.save(authSession)
    }

    companion object {
        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }
}