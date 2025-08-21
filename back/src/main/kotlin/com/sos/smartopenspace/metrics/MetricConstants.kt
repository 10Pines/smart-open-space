package com.sos.smartopenspace.metrics


const val BASE_METRIC = "server_request"
const val BUSINESS_METRIC = "sos_business"

const val USER_REGISTER_METRIC = "user_register"


fun getBusinessMetricWith(metricName: String): String =
  "${BUSINESS_METRIC}_$metricName"
