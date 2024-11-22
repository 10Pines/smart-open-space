package com.sos.smartopenspace.aspect

/**
 * This annotation enable to log at two points:
 * - BEFORE execute with the input of method and after result log if success
 * - AFTER execute if method success WITH result
 */
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class LoggingExecution

/**
 * This annotation enable to log at two points:
 * - BEFORE execute with the input of method and after result log if success
 * - AFTER execute if method success WITHOUT result
 */
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class LoggingInputExecution