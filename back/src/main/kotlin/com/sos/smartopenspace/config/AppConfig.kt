package com.sos.smartopenspace.config


import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class AppConfig {

    @Bean
    fun objectMapper(): ObjectMapper =
        ObjectMapperUtil.build()


}