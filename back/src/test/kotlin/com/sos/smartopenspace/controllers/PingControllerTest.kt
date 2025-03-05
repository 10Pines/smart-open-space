package com.sos.smartopenspace.controllers

import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.get

class PingControllerTest: BaseControllerTest() {

    @Test
    fun `when do ping should return status ok`() {
        mockMvc.get("/ping").andExpect { status { isOk() } }
    }

    @Test
    fun `when do ping with no path should return status ok`() {
        mockMvc.get("/").andExpect { status { isOk() } }
    }
}