package com.sos.smartopenspace.aspect

import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.AfterReturning
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.aspectj.lang.annotation.Pointcut
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Aspect
@Component
class ControllerLoggingAspect {

    companion object {
        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }

    @Pointcut("within(com.sos.smartopenspace.controllers..*) " +
            "&& !within(com.sos.smartopenspace.controllers.PingController)")
    fun controllerMethods() {}

    @Before("controllerMethods() && args(..)")
    fun logBefore(joinPoint: JoinPoint) {
        val methodName = joinPoint.signature.name
        val className = joinPoint.target::class.simpleName
        val args = joinPoint.args.joinToString(", ") { "$it" }
        LOGGER.info("Executing method: $className.$methodName with arguments: [$args]")
    }

    @AfterReturning(pointcut = "controllerMethods()", returning = "result")
    fun logAfterReturning(joinPoint: JoinPoint, result: Any?) {
        val methodName = joinPoint.signature.name
        val className = joinPoint.target::class.simpleName
        LOGGER.info("Success execution of method: $className.$methodName with result: $result")
    }
}