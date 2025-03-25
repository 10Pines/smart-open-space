package com.sos.smartopenspace.metrics

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource

class MetricConstantsTest {

    @ParameterizedTest
    @CsvSource(
        "user_register,sos_business_user_register",
        "user_login,sos_business_user_login",
        "sarasa,sos_business_sarasa",
        "'',sos_business_",
    )
    fun `test getBusinessMetricWith`(metricName: String, expected: String) {
        assertEquals(expected, getBusinessMetricWith(metricName))
    }
}