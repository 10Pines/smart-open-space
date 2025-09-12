package com.sos.smartopenspace.metrics

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource

class TagValuesConstantsTest {

  @ParameterizedTest
  @CsvSource(
    "sarasa,sarasa",
    "sarasa with space,sarasa_with_space",
    "SARASA UPPER,sarasa_upper",
    "'',none",
    "' ',none",
  )
  fun `test getAtMaxWidthOrEmptyValueIfBlank`(
    tagValue: String,
    expected: String
  ) {
    assertEquals(expected, getAtMaxWidthOrEmptyValueIfBlank(tagValue))
  }


  @ParameterizedTest
  @CsvSource(
    "sarasa,sarasa",
    "sarasa with space,sarasa_with_space",
    "SARASA UPPER,sarasa_upper",
    "'',none",
    "' ',none",
    "null,none",
    nullValues = ["null"]
  )
  fun `test getAtMaxWidthOrEmptyValueIfBlankOrNull`(
    tagValue: String?,
    expected: String
  ) {
    assertEquals(expected, getAtMaxWidthOrEmptyValueIfBlankOrNull(tagValue))
  }
}
