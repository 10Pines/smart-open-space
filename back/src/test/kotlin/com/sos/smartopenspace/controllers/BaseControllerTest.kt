package com.sos.smartopenspace.controllers

import com.fasterxml.jackson.databind.ObjectMapper
import com.sos.smartopenspace.persistence.*
import com.sos.smartopenspace.services.UserService
import com.sos.smartopenspace.services.impl.AuthService
import com.sos.smartopenspace.services.impl.JwtService
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
    protected lateinit var objectMapper: ObjectMapper

    @Autowired
    protected lateinit var userRepo: UserRepository

    @Autowired
    protected lateinit var authSessionRepo: AuthSessionRepository

    @Autowired
    protected lateinit var openSpaceRepo: OpenSpaceRepository

    @Autowired
    protected lateinit var talkRepo: TalkRepository

    @Autowired
    protected lateinit var slotRepository: SlotRepository

    @Autowired
    protected lateinit var openSpaceRepository: OpenSpaceRepository

    @Autowired
    protected lateinit var talkRepository: TalkRepository

    @Autowired
    protected lateinit var roomRepository: RoomRepository

    @Autowired
    protected lateinit var authService: AuthService

    @Autowired
    protected lateinit var userService: UserService

    @Autowired
    protected lateinit var jwtService: JwtService

    protected fun clearAllEntities() {
        authSessionRepo.deleteAll()
        userRepo.deleteAll()
    }

    //FIXME: Add after each tearDown method to clear all entities
    //  Not implemented because exist tests with state that needs to be preserved
}