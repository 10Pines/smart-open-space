package com.sos.smartopenspace.metrics

import io.micrometer.common.KeyValues
import io.micrometer.observation.tck.TestObservationRegistry
import io.micrometer.observation.tck.TestObservationRegistryAssert.assertThat
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.http.server.observation.ServerRequestObservationContext
import org.springframework.web.filter.ServerHttpObservationFilter


class ObservationMetricHelperTest {

  private lateinit var observationRegistry: TestObservationRegistry

  private lateinit var observationMetricHelper: ObservationMetricHelper

  @MockK
  private lateinit var httpServletRequest: HttpServletRequest

  @MockK
  private lateinit var httpServletResponse: HttpServletResponse

  @BeforeEach
  fun setUp() {
    MockKAnnotations.init(this)
    observationRegistry = TestObservationRegistry.create()
    observationMetricHelper = ObservationMetricHelper(observationRegistry)
  }

  @Test
  fun `test observeBusinessChecked observes ok`() {
    val newMetric = "some_metric_name"

    val expectedFunRes = "sarasa_result"
    val res = observationMetricHelper.observeBusinessChecked<String, Exception>(
      newMetric,
      KeyValues.of("result", "ok", "is_test", "true")
    ) {
      expectedFunRes
    }


    assertEquals(expectedFunRes, res!!)

    val expectedMetric = getBusinessMetricWith(newMetric)
    assertThat(observationRegistry)
      .doesNotHaveAnyRemainingCurrentObservation()
      .hasObservationWithNameEqualTo(expectedMetric)
      .that()
      .hasLowCardinalityKeyValue("result", "ok")
      .hasLowCardinalityKeyValue("is_test", "true")
      .hasBeenStarted()
      .hasBeenStopped()
  }

  @Test
  fun `test observeBusinessChecked and addTags observes throwing exception and override tags`() {
    val newMetric = "some_metric_name"


    val resultTagValue = "error"
    val errorMsg = "invalid_operation"
    val exRes = assertThrows<RuntimeException> {
      observationMetricHelper.observeBusinessChecked<String, Exception>(
        newMetric,
        KeyValues.of("result", "ok", "is_test", "true")
      ) {
        observationMetricHelper.addMetricTags(
          mapOf(
            "result" to resultTagValue,
            "error_message" to errorMsg,
          )
        )
        throw RuntimeException(errorMsg)
      }
    }

    assertEquals(errorMsg, exRes.message)
    val expectedMetric = getBusinessMetricWith(newMetric)
    assertThat(observationRegistry)
      .doesNotHaveAnyRemainingCurrentObservation()
      .hasObservationWithNameEqualTo(expectedMetric)
      .that()
      .hasLowCardinalityKeyValue("result", resultTagValue)
      .hasLowCardinalityKeyValue("is_test", "true")
      .hasLowCardinalityKeyValue("error_message", errorMsg)
      .hasBeenStarted()
      .hasBeenStopped()
  }

  @Test
  fun `test observeBusinessChecked with request with context should add Context`() {
    val observationContext =
      ServerRequestObservationContext(httpServletRequest, httpServletResponse)
    val newMetric = "some_metric_name"
    val contextKey = "some_context_key"
    val valueContextKey = mapOf<String, Any>("key_a" to "value_a", "key_b" to 2)

    every { httpServletRequest.getAttribute(ServerHttpObservationFilter::class.java.name + ".context") } returns observationContext

    val expectedFunRes = "sarasa_result"
    val res = observationMetricHelper.observeBusinessChecked<String, Exception>(
      newMetric,
      KeyValues.of("result", "ok", "is_test", "true")
    ) {
      observationMetricHelper.addContext(
        httpServletRequest,
        contextKey,
        valueContextKey
      )
      expectedFunRes
    }


    assertEquals(expectedFunRes, res!!)

    val expectedMetric = getBusinessMetricWith(newMetric)
    assertThat(observationRegistry)
      .doesNotHaveAnyRemainingCurrentObservation()
      .hasObservationWithNameEqualTo(expectedMetric)
      .that()
      .hasLowCardinalityKeyValue("result", "ok")
      .hasLowCardinalityKeyValue("is_test", "true")
      .hasBeenStarted()
      .hasBeenStopped()

    assertEquals(valueContextKey, observationContext.get(contextKey))
  }

  @Test
  fun `test observeBusinessChecked with request without context should not add Context and not throws anything`() {
    val newMetric = "some_metric_name"
    val contextKey = "some_context_key"
    val valueContextKey = mapOf<String, Any>("key_a" to "value_a", "key_b" to 2)

    every { httpServletRequest.getAttribute(ServerHttpObservationFilter::class.java.name + ".context") } returns null

    val expectedFunRes = "sarasa_result"
    val res = observationMetricHelper.observeBusinessChecked<String, Exception>(
      newMetric,
      KeyValues.of("result", "ok", "is_test", "true")
    ) {
      observationMetricHelper.addContext(
        httpServletRequest,
        contextKey,
        valueContextKey
      )
      expectedFunRes
    }


    assertEquals(expectedFunRes, res!!)

    val expectedMetric = getBusinessMetricWith(newMetric)
    assertThat(observationRegistry)
      .doesNotHaveAnyRemainingCurrentObservation()
      .hasObservationWithNameEqualTo(expectedMetric)
      .that()
      .hasLowCardinalityKeyValue("result", "ok")
      .hasLowCardinalityKeyValue("is_test", "true")
      .hasBeenStarted()
      .hasBeenStopped()
  }

  @Test
  fun `test observeBusinessChecked with request with context value null should not add Context`() {
    val observationContext =
      ServerRequestObservationContext(httpServletRequest, httpServletResponse)
    val newMetric = "some_metric_name"
    val contextKey = "some_context_key"

    every { httpServletRequest.getAttribute(ServerHttpObservationFilter::class.java.name + ".context") } returns observationContext

    val expectedFunRes = "sarasa_result"
    val res = observationMetricHelper.observeBusinessChecked<String, Exception>(
      newMetric,
      KeyValues.of("result", "ok", "is_test", "true")
    ) {
      observationMetricHelper.addContext(httpServletRequest, contextKey, null)
      expectedFunRes
    }


    assertEquals(expectedFunRes, res!!)

    val expectedMetric = getBusinessMetricWith(newMetric)
    assertThat(observationRegistry)
      .doesNotHaveAnyRemainingCurrentObservation()
      .hasObservationWithNameEqualTo(expectedMetric)
      .that()
      .hasLowCardinalityKeyValue("result", "ok")
      .hasLowCardinalityKeyValue("is_test", "true")
      .hasBeenStarted()
      .hasBeenStopped()

    assertNull(observationContext.get(contextKey))
  }


}
