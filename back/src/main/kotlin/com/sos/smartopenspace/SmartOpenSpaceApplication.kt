package com.sos.smartopenspace

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@SpringBootApplication
@EnableCaching
class SmartOpenSpaceApplication

fun main(args: Array<String>) {
  runApplication<SmartOpenSpaceApplication>(*args)
}
