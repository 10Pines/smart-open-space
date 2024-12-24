package com.sos.smartopenspace.controllers.v1

import com.sos.smartopenspace.controllers.BaseControllerTest
import com.sos.smartopenspace.persistence.AuthSessionRepository
import com.sos.smartopenspace.persistence.UserRepository
import com.sos.smartopenspace.services.impl.JwtService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean

class AuthControllerTest: BaseControllerTest() {

    @Autowired
    lateinit var userRepo: UserRepository

    @Autowired
    lateinit var authSessionRepo: AuthSessionRepository

    @MockBean
    lateinit var jwtService: JwtService

    //TODO: Do tests
}