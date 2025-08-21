package com.sos.smartopenspace.config

import org.slf4j.LoggerFactory
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
  init {
    LOGGER.info("CorsProps=$this")
  }

  fun corsAllowedMethods(): Array<String> =
    getArrayFromStringRaw(corsAllowedMethods).also {
      logArrayValue("Allowed CORS methods", it)
    }

  fun corsAllowedOrigins(): Array<String> =
    getArrayFromStringRaw(corsAllowedOrigins).also {
      logArrayValue("Allowed CORS origins", it)
    }

  fun corsSocketOrigins(): Array<String> =
    getArrayFromStringRaw(corsAllowedSocketOrigins).also {
      logArrayValue("Allowed CORS socket origins", it)
    }

  private fun getArrayFromStringRaw(stringRaw: String): Array<String> =
    stringRaw.split(",").map { it.trim() }.toTypedArray()

  private fun logArrayValue(header: String, value: Array<String>) {
    LOGGER.info("${header}: ${value.joinToString(", ")}")
  }

  override fun toString() =
    "CorsProps(corsAllowedMethods='$corsAllowedMethods', corsAllowedOrigins='$corsAllowedOrigins', corsAllowedSocketOrigins='$corsAllowedSocketOrigins')"


  companion object {
    private val LOGGER = LoggerFactory.getLogger(this::class.java)
  }

}
