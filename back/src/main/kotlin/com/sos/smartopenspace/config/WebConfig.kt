package com.sos.smartopenspace.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig(
  private val corsProps: CorsProps
) : WebMvcConfigurer {
  override fun addCorsMappings(registry: CorsRegistry) {
    registry
      .addMapping("/**")
      .allowedMethods(*corsProps.corsAllowedMethods())
      .allowedOrigins(*corsProps.corsAllowedOrigins())
  }
}
