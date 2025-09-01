package com.sos.smartopenspace.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/test")
class TestController {

  /**
   * This endpoint is for test purpose
   */
  @GetMapping("/internal_server_error")
  fun errorFallback(): String {
    throw IllegalArgumentException("test error fallback")
  }
}