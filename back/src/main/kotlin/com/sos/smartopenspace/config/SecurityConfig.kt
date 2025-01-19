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
        val cfg = http.csrf { it.disable() }
            .sessionManagement { s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { authReq ->
                PUBLIC_ENDPOINTS.forEach { (method, requestMatchers) ->
                    when (method) {
                        ANY_HTTP_METHOD -> requestMatchers.forEach {
                            authReq.requestMatchers(it.pattern).permitAll()
                        }
                        else -> requestMatchers.forEach {
                            authReq.requestMatchers(HttpMethod.valueOf(method), it.pattern).permitAll()
                        }
                    }
                }
                authReq.anyRequest().authenticated()
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .build()
        return cfg
    }

}