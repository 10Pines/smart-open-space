package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.persistence.AuthSessionRepository
import com.sos.smartopenspace.persistence.UserRepository
import org.junit.jupiter.api.AfterEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
abstract class BaseControllerTest {
    @Autowired
    protected lateinit var mockMvc: MockMvc

    @Autowired
    protected lateinit var userRepo: UserRepository

    @Autowired
    protected lateinit var authSessionRepo: AuthSessionRepository

    protected fun clearAllEntities() {
        authSessionRepo.deleteAll()
        userRepo.deleteAll()
    }

    //FIXME: Add after each tearDown method to clear all entities
    //  Not implemented because exist tests with state that needs to be preserved
}