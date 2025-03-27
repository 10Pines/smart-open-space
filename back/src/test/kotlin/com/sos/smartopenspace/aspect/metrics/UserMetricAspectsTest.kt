package com.sos.smartopenspace.aspect.metrics

import com.sos.smartopenspace.domain.BadRequestException
import com.sos.smartopenspace.metrics.*
import io.micrometer.common.KeyValues
import io.micrometer.observation.tck.TestObservationRegistry
import io.micrometer.observation.tck.TestObservationRegistryAssert.assertThat
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import org.aspectj.lang.ProceedingJoinPoint
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class UserMetricAspectsTest {

    private lateinit var observationRegistry: TestObservationRegistry
    private lateinit var observationMetricHelper: ObservationMetricHelper
    private lateinit var userMetricAspects: UserMetricAspects

    @MockK
    private lateinit var proceedingJoinPoint: ProceedingJoinPoint

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        observationRegistry = TestObservationRegistry.create()
        observationRegistry.currentObservation
        observationMetricHelper = ObservationMetricHelper(observationRegistry)
        userMetricAspects = UserMetricAspects(observationMetricHelper)
    }

    @Test
    fun `test observeAroundUserRegisterMetric should return ProceedingJoinPoint result, add metric with empty error tags`() {
        val expectedRes = "some_result"
        every { proceedingJoinPoint.proceed() } returns expectedRes

        // WHEN
        val res = userMetricAspects.observeAroundUserRegisterMetric(proceedingJoinPoint)

        // THEN
        assertEquals(expectedRes, res)
        val expectedMetric = getBusinessMetricWith(USER_REGISTER_METRIC)
        assertThat(observationRegistry)
            .doesNotHaveAnyRemainingCurrentObservation()
            .hasObservationWithNameEqualTo(expectedMetric)
            .that()
            .hasLowCardinalityKeyValue(TAG_EX_CLASSNAME, TAG_EMPTY_VALUE)
            .hasLowCardinalityKeyValue(TAG_ERROR_NAME, TAG_EMPTY_VALUE)
            .hasLowCardinalityKeyValue(TAG_ERROR_CODE, TAG_EMPTY_VALUE)
            .hasLowCardinalityKeyValue(TAG_ERROR_MESSAGE, TAG_EMPTY_VALUE)
            .hasBeenStarted()
            .hasBeenStopped()
    }

    @Test
    fun `test observeAroundUserRegisterMetric throws a no expected exception should overrides error tags with some unknown values`() {
        val ex = RuntimeException("some_exception")
        val defaultEmptyTags = KeyValues.of(
            TAG_ERROR_NAME, TAG_EMPTY_VALUE,
            TAG_ERROR_CODE, TAG_EMPTY_VALUE,
            TAG_ERROR_MESSAGE, TAG_EMPTY_VALUE,
            TAG_EX_CLASSNAME, TAG_EMPTY_VALUE,
        )

        val exRes = assertThrows<RuntimeException> {
            observationMetricHelper.observeBusinessChecked<Any, Throwable>(
                USER_REGISTER_METRIC,
                defaultEmptyTags
            ) {
                userMetricAspects.observeAfterThrowingUserRegisterMetric(ex)
                throw ex
            }
        }

        // THEN
        assertEquals(ex, exRes)
        val expectedMetric = getBusinessMetricWith(USER_REGISTER_METRIC)
        assertThat(observationRegistry)
            .doesNotHaveAnyRemainingCurrentObservation()
            .hasObservationWithNameEqualTo(expectedMetric)
            .that()
            .hasLowCardinalityKeyValue(TAG_EX_CLASSNAME, ex.javaClass.simpleName.lowercase())
            .hasLowCardinalityKeyValue(TAG_ERROR_NAME, TAG_UNKNOWN_VALUE)
            .hasLowCardinalityKeyValue(TAG_ERROR_CODE, TAG_UNKNOWN_VALUE)
            .hasLowCardinalityKeyValue(TAG_ERROR_MESSAGE, TAG_UNKNOWN_VALUE)
            .hasBeenStarted()
            .hasBeenStopped()
    }

    @Test
    fun `test observeAroundUserRegisterMetric throws an expected BadRequestException should overrides error tags with some unknown values`() {
        val ex = BadRequestException("bad request exception")
        val defaultEmptyTags = KeyValues.of(
            TAG_ERROR_NAME, TAG_EMPTY_VALUE,
            TAG_ERROR_CODE, TAG_EMPTY_VALUE,
            TAG_ERROR_MESSAGE, TAG_EMPTY_VALUE,
            TAG_EX_CLASSNAME, TAG_EMPTY_VALUE,
        )

        val exRes = assertThrows<RuntimeException> {
            observationMetricHelper.observeBusinessChecked<Any, Throwable>(
                USER_REGISTER_METRIC,
                defaultEmptyTags
            ) {
                userMetricAspects.observeAfterThrowingUserRegisterMetric(ex)
                throw ex
            }
        }

        // THEN
        assertEquals(ex, exRes)
        val expectedMetric = getBusinessMetricWith(USER_REGISTER_METRIC)
        assertThat(observationRegistry)
            .doesNotHaveAnyRemainingCurrentObservation()
            .hasObservationWithNameEqualTo(expectedMetric)
            .that()
            .hasLowCardinalityKeyValue(TAG_EX_CLASSNAME, ex.javaClass.simpleName.lowercase())
            .hasLowCardinalityKeyValue(TAG_ERROR_NAME, TAG_INVALID_CLIENT_REQ_VALUE)
            .hasLowCardinalityKeyValue(TAG_ERROR_CODE, "400")
            .hasLowCardinalityKeyValue(TAG_ERROR_MESSAGE, "bad_request_exception")
            .hasBeenStarted()
            .hasBeenStopped()
    }
}