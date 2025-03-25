package com.sos.smartopenspace.config

import com.sos.smartopenspace.metrics.CustomServerRequestObservationConvention
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ObservationConfig {

    @Bean
    fun serverRequestObservationConvention() =
        CustomServerRequestObservationConvention()
}