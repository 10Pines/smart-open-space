package com.sos.smartopenspace.config

import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@Profile("dev", "docker")
class WebConfig : WebMvcConfigurer {
  override fun addCorsMappings(registry: CorsRegistry) {
    registry
      .addMapping("/**")
      .allowedMethods("GET", "PUT", "POST", "DELETE")
      .allowedOrigins("http://localhost:1234", "http://localhost:80", "http://192.168.184.124:80","https://smartopenspace.herokuapp.com", "https://smartopenspace.10pines.com")
  }
}
