package com.sos.smartopenspace.metrics

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource

class MetricConstantsTest {

    @ParameterizedTest
    @CsvSource(
        "user_register,sos.business.user_register",
        "user_login,sos.business.user_login",
        "sarasa,sos.business.sarasa",
        "'',sos.business.",
    )
    fun `test getBusinessMetricWith`(metricName: String, expected: String) {
        assertEquals(expected, getBusinessMetricWith(metricName))
    }
}