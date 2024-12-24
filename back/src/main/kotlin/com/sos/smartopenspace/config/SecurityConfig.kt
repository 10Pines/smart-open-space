package com.sos.smartopenspace.config

import com.sos.smartopenspace.config.filter.JwtAuthFilter.Companion.AUTH_PREFIX
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .csrf { it.disable() }
            .authorizeHttpRequests { authReq ->
                authReq
                    .requestMatchers(AUTH_ENDPOINTS).permitAll()
                    //TODO: Change to match with authenticated with expected endpoints
                    // .requestMatchers("/x/**").authenticated()
                    .anyRequest().permitAll()
            }
            .sessionManagement { s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .build()

    companion object {
        private const val AUTH_ENDPOINTS = "$AUTH_PREFIX/**"
    }
}