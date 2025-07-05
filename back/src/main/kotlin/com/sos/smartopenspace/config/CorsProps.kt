package com.sos.smartopenspace.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration

@Configuration
class CorsProps(
    @Value("\${app.cors.allowed.methods}")
    val corsAllowedMethods: String,
    @Value("\${app.cors.allowed.origins}")
    val corsAllowedOrigins: String,
    @Value("\${app.cors.allowed.socket-origins}")
    val corsAllowedSocketOrigins: String,
) {
    fun corsAllowedMethods(): Array<String> = getArrayFromStringRaw(corsAllowedMethods)
    fun corsAllowedOrigins(): Array<String> = getArrayFromStringRaw(corsAllowedOrigins)
    fun corsSocketOrigins(): Array<String> = getArrayFromStringRaw(corsAllowedSocketOrigins)

    private fun getArrayFromStringRaw(stringRaw: String): Array<String> =
        stringRaw.split(",").map { it.trim() }.toTypedArray()
}