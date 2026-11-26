package com.sos.smartopenspace.config

import tools.jackson.core.JsonGenerator
import tools.jackson.databind.DeserializationFeature
import tools.jackson.databind.MapperFeature
import tools.jackson.databind.SerializationContext
import tools.jackson.databind.SerializationFeature
import tools.jackson.databind.ValueSerializer
import tools.jackson.databind.cfg.DateTimeFeature
import tools.jackson.databind.cfg.EnumFeature
import tools.jackson.databind.json.JsonMapper
import tools.jackson.databind.module.SimpleModule
import tools.jackson.module.kotlin.kotlinModule
import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter

object ObjectMapperUtil {

  const val DATE_FORMAT = "yyyy-MM-dd"
  const val TIME_FORMAT = "HH:mm"

  // Devuelve JsonMapper (y no ObjectMapper) para que la autoconfiguración de
  // Jackson de Spring Boot 4 se retire y use este mapper también en Spring MVC.
  fun build(): JsonMapper {
    val objectMapperBuilder =
      JsonMapper.builder().enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS)

    objectMapperBuilder.enable(MapperFeature.USE_GETTERS_AS_SETTERS)
    objectMapperBuilder.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
    objectMapperBuilder.disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
    objectMapperBuilder.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS)

    objectMapperBuilder.enable(EnumFeature.READ_UNKNOWN_ENUM_VALUES_USING_DEFAULT_VALUE)

    // Jackson 3 trae soporte java.time en el módulo databind: no hace falta JavaTimeModule.
    val javaTimeModule = SimpleModule()
    javaTimeModule.addSerializer(LocalTime::class.java, localTimeSerializer())
    javaTimeModule.addSerializer(LocalDate::class.java, localDateSerializer())
    objectMapperBuilder.addModule(javaTimeModule)

    objectMapperBuilder.addModule(kotlinModule())

    return objectMapperBuilder.build()
  }

  private fun localTimeSerializer(): ValueSerializer<LocalTime> {
    return object : ValueSerializer<LocalTime>() {
      override fun serialize(
        localTime: LocalTime, jsonGenerator: JsonGenerator,
        serializationContext: SerializationContext
      ) {
        jsonGenerator.writeString(
          localTime.format(
            DateTimeFormatter.ofPattern(
              TIME_FORMAT
            )
          )
        )
      }
    }
  }

  private fun localDateSerializer(): ValueSerializer<LocalDate> {
    return object : ValueSerializer<LocalDate>() {
      override fun serialize(
        localDate: LocalDate, jsonGenerator: JsonGenerator,
        serializationContext: SerializationContext
      ) {
        jsonGenerator.writeString(
          localDate.format(
            DateTimeFormatter.ofPattern(
              DATE_FORMAT
            )
          )
        )
      }
    }
  }

}
