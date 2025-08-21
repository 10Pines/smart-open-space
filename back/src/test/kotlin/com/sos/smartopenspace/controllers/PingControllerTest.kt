package com.sos.smartopenspace.controllers

import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.get

class PingControllerTest : BaseIntegrationTest() {

  @Test
  fun `when do ping should return status ok`() {
    mockMvc.get("/ping").andExpect { status { isOk() } }
  }

}
