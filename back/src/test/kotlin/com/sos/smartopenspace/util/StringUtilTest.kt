package com.sos.smartopenspace.util

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class StringUtilTest {

  @Test
  fun `test toStringByReflex of null`() {
    val res = toStringByReflex(null)
    assertEquals("null", res)
  }

  @Test
  fun `test toStringByReflex of sample class`() {
    class Sample(val id: Long, val name: String) {}

    val res = toStringByReflex(Sample(12, "test"))
    assertEquals("Sample(id=12, name=test)", res)
  }

  @Test
  fun `test toStringByReflex of sample class of nested classes`() {
    //GIVEN
    data class DataNested(
      val id: Long,
      val name: String,
    )

    class ClassNested(
      val id: Long,
      val name: String,
    ) {
      override fun toString(): String =
        toStringByReflex(this)
    }

    class SampleNested

    class Sample(
      val id: Long,
      val name: String,
      val nestedData: DataNested,
      val nestedClass: ClassNested,
    )

    val input = Sample(
      id = 1,
      name = "testSample1",
      nestedData = DataNested(12, "testData"),
      nestedClass = ClassNested(13, "testClass")
    )

    // WHEN
    val res = toStringByReflex(input)

    // THEN
    val expectedRes =
      "Sample(id=1, name=testSample1, nestedClass=ClassNested(id=13, name=testClass), nestedData=DataNested(id=12, name=testData))"
    assertEquals(expectedRes, res)
  }

  @Test
  fun `test toStringByReflex of sample class, exclude and mask fields`() {
    class Sample(
      val id: Long,
      val name: String,
      val excludeField1: String,
      val excludeField2: Long,
      val password: String,
      val excludeField3: Any
    )

    val input = Sample(
      id = 12,
      name = "test",
      excludeField1 = "exclude1",
      excludeField2 = 112312,
      excludeField3 = "a" to "b",
      password = "jeje123456xD"
    )
    val res = toStringByReflex(
      input,
      mask = listOf("password"),
      exclude = listOf("excludeField1", "excludeField2", "excludeField3")
    )

    val expectedRes = "Sample(id=12, name=test, password=***)"
    assertEquals(expectedRes, res)
  }

  @Test
  fun `test toStringByReflex of sample class, only exclude fields`() {
    class Sample(
      val id: Long,
      val name: String,
      val excludeField1: String,
      val excludeField2: Long,
      val password: String,
      val excludeField3: Any
    )

    val input = Sample(
      id = 12,
      name = "test",
      excludeField1 = "exclude1",
      excludeField2 = 112312,
      excludeField3 = "a" to "b",
      password = "jeje123456xD"
    )
    val res = toStringByReflex(
      input,
      exclude = listOf("excludeField1", "excludeField2", "excludeField3")
    )

    val expectedRes = "Sample(id=12, name=test, password=jeje123456xD)"
    assertEquals(expectedRes, res)
  }

  @Test
  fun `test toStringByReflex of sample class, only mask fields`() {
    class Sample(
      val id: Long,
      val name: String,
      val excludeField1: String,
      val password: String,
      val sensitiveData: Any
    )

    val input = Sample(
      id = 12,
      name = "test",
      excludeField1 = "exclude1",
      sensitiveData = "key" to "sensitiveData",
      password = "jeje123456xD"
    )
    val res = toStringByReflex(
      input,
      mask = listOf("password", "sensitiveData")
    )

    val expectedRes =
      "Sample(excludeField1=exclude1, id=12, name=test, password=***, sensitiveData=***)"
    assertEquals(expectedRes, res)
  }
}