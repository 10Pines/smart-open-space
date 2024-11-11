package com.sos.smartopenspace.aspect

import org.aspectj.lang.JoinPoint
import org.aspectj.lang.annotation.AfterReturning
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.aspectj.lang.reflect.MethodSignature
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Aspect
@Component
class LoggingAspects {

    companion object {
        private val LOGGER = LoggerFactory.getLogger(this::class.java)
    }

    @Before("@annotation(com.sos.smartopenspace.aspect.LoggingExecution) " +
            "|| @annotation(com.sos.smartopenspace.aspect.LoggingInputExecution)")
    fun logBefore(joinPoint: JoinPoint) {
        val methodName = joinPoint.signature.name
        val className = joinPoint.target::class.simpleName
        val paramNames = getSignatureParameterNames(joinPoint).joinToString(", ")
        val args = joinPoint.args.joinToString(", ") { "$it" }
        LOGGER.info("Executing method: $className.$methodName(${paramNames}) with arguments: [$args]")
    }

    @AfterReturning(pointcut = "@annotation(com.sos.smartopenspace.aspect.LoggingExecution)", returning = "result")
    fun logResultAfterReturning(joinPoint: JoinPoint, result: Any?) {
        val methodName = joinPoint.signature.name
        val className = joinPoint.target::class.simpleName
        LOGGER.info("Success execution of method: $className.$methodName with result: $result")
    }

    @AfterReturning(pointcut = "@annotation(com.sos.smartopenspace.aspect.LoggingInputExecution)")
    fun logSuccessAfterReturning(joinPoint: JoinPoint) {
        val methodName = joinPoint.signature.name
        val className = joinPoint.target::class.simpleName
        LOGGER.info("Success execution of method: $className.$methodName")
    }

    private fun getSignatureParameterNames(joinPoint: JoinPoint): List<String> {
        try {
            return (joinPoint.signature as MethodSignature).parameterNames.toList()
        }catch (e: Exception){
            LOGGER.warn("Could not get parameterNames from JoinPoint.", e)
            return listOf()
        }
    }

}