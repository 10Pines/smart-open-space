package com.sos.smartopenspace.controllers

import com.sos.smartopenspace.domain.*
import com.sos.smartopenspace.persistence.OpenSpaceRepository
import com.sos.smartopenspace.persistence.TalkRepository
import com.sos.smartopenspace.persistence.UserRepository
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.transaction.annotation.Transactional


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class UserControllerTest {

  @Autowired
  lateinit var mockMvc: MockMvc


  @Autowired
  lateinit var repoUser: UserRepository

  @Autowired
  lateinit var repoOpenSpace: OpenSpaceRepository

  @Test
  fun `user registration returns ok status response`() {
    val email = "email@gmail.com"
    val password = "password"
    val name = "Fran"
    val userInformation = anUserCreationBody(email = email, password = password, name = name)

    mockMvc.perform(
      MockMvcRequestBuilders.post("/user")
        .contentType("application/json")
        .content(userInformation)
    ).andExpect(MockMvcResultMatchers.status().isOk)
    assertNotNull(repoUser.findByEmail(email))
  }

  @Test
  fun `user login returns ok status response`() {
    val email = "email@gmail.com"
    val password = "password"
    val userInformation = anUserCreationBody(email = email, password = password, name = "Fran")
    mockMvc.perform(
      MockMvcRequestBuilders.post("/user")
        .contentType("application/json")
        .content(userInformation)
    )
    val userLoginInformation = """
          {
                "email": "${email}",
                "password": "${password}"
          }
      """
    mockMvc.perform(
      MockMvcRequestBuilders.post("/user/auth")
        .contentType("application/json")
        .content(userLoginInformation)
    ).andExpect(MockMvcResultMatchers.status().isOk)
  }

    @Test
    fun `user login returns bad request status response`() {
        val email = "email@gmail.com"
        val password = "password"
        val userInformation = anUserCreationBody(email = email, password = password, name = "Fran")
        mockMvc.perform(
            MockMvcRequestBuilders.post("/user")
                .contentType("application/json")
                .content(userInformation)
        )
        val userLoginInformation = """
          {
                "email": "${email}",
                "password": "OtraPassword"
          }
      """
        mockMvc.perform(
            MockMvcRequestBuilders.post("/user/auth")
                .contentType("application/json")
                .content(userLoginInformation)
        ).andExpect(MockMvcResultMatchers.status().isBadRequest)
    }

  private fun anUserCreationBody(email: String, password: String, name: String): String {
    return return """
{
    "email": "${email}",
    "name": "${name}",
    "password": "${password}"
}
        """
  }
}