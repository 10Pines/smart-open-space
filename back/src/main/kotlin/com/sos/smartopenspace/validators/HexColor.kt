package com.sos.smartopenspace.validators

import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import kotlin.reflect.KClass
import kotlin.text.Regex as TextRegex


@Target(AnnotationTarget.FIELD, AnnotationTarget.TYPE)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [HexColorValidator::class])
annotation class HexColor(
  val message: String = "color is not a valid hexcolor",
  val groups: Array<KClass<*>> = [],
  val payload: Array<KClass<out Payload>> = []

)

class HexColorValidator : ConstraintValidator<HexColor, String> {
  override fun isValid(
    value: String?,
    context: ConstraintValidatorContext?
  ): Boolean {
    val regex = TextRegex("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\$")
    return regex.containsMatchIn(value.toString())
  }

}
