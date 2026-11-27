package com.sos.smartopenspace.config

import com.sos.smartopenspace.config.filter.JwtAuthFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter


@Configuration
@EnableWebSecurity
class SecurityConfig(
  private val jwtAuthFilter: JwtAuthFilter
) {

  @Bean
  fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
    // CSRF deshabilitado a propósito: la API es stateless y autentica solo con el header
    // Authorization (Bearer JWT), sin cookies. Si el token pasa a una cookie, hay que
    // habilitar CSRF en ese mismo cambio. Ver docs/adrs/003_csrf_deshabilitado_con_jwt_stateless.md
    val cfg = http.csrf { it.disable() }
      .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
      .authorizeHttpRequests { authReq ->
        PUBLIC_ENDPOINTS.forEach { (method, patterns) ->
          when (method) {
            ANY_HTTP_METHOD -> patterns.forEach {
              authReq.requestMatchers(it).permitAll()
            }

            else -> patterns.forEach {
              authReq.requestMatchers(HttpMethod.valueOf(method), it)
                .permitAll()
            }
          }
        }
        authReq.anyRequest().authenticated()
      }
      .addFilterBefore(
        jwtAuthFilter,
        UsernamePasswordAuthenticationFilter::class.java
      )
      .formLogin { it.disable() }
      .httpBasic { it.disable() }
      .build()
    return cfg
  }

}
