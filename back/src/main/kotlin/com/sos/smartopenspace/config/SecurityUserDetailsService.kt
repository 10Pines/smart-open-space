package com.sos.smartopenspace.config

import com.sos.smartopenspace.domain.UserNotFoundException
import com.sos.smartopenspace.dto.security.UserDetailsDTO
import com.sos.smartopenspace.persistence.UserRepository
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class SecurityUserDetailsService (
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(userId: String?): UserDetailsDTO {
        return runCatching {
            UserDetailsDTO(
                userRepository.findById(userId!!.toLong())
                    .orElseThrow { UserNotFoundException() })
        }.getOrElse {
            throw UsernameNotFoundException("User not found")
        }
    }
}