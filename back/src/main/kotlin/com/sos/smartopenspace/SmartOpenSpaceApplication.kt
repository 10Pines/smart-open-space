package com.sos.smartopenspace

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.EnableAspectJAutoProxy

@SpringBootApplication
@EnableAspectJAutoProxy
class SmartOpenSpaceApplication

fun main(args: Array<String>) {
  runApplication<SmartOpenSpaceApplication>(*args)
}
