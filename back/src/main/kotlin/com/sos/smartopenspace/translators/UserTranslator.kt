package com.sos.smartopenspace.translators

import com.sos.smartopenspace.domain.User
import com.sos.smartopenspace.dto.request.auth.RegisterRequestDTO
import com.sos.smartopenspace.dto.response.UserResponseDTO

object UserTranslator {
    fun translateToUserResponse(domain: User) =
        UserResponseDTO(
            id = domain.id,
            email = domain.email,
            name = domain.name,
        )

    fun translateRegisterRequest(registerReq: RegisterRequestDTO) =
        User(
            email = registerReq.email,
            name = registerReq.name,
            password = registerReq.password,
        )
}