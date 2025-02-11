package com.sos.smartopenspace.metrics

import io.micrometer.common.KeyValue
import io.micrometer.common.KeyValues
import io.micrometer.observation.Observation
import io.micrometer.observation.ObservationRegistry
import jakarta.servlet.http.HttpServletRequest
import org.springframework.stereotype.Component
import org.springframework.web.filter.ServerHttpObservationFilter

@Component
class ObservationMetricHelper(
    val observationRegistry: ObservationRegistry
) {

    fun <T> addContext(request: HttpServletRequest, contextKey: String, value: T?) {
        value?.also {
            val maybeCtx = ServerHttpObservationFilter.findObservationContext(request)
            maybeCtx.ifPresent { it.put(contextKey, value) }
        }
    }

    fun <T, E : Throwable> observeBusinessChecked(
        metricNameSuffix: String, tags: KeyValues, function: Observation.CheckedCallable<T, E>
    ): T? {
        val metricName = getBusinessMetricWith(metricNameSuffix)
        return Observation.createNotStarted(metricName, observationRegistry)
            .contextualName(buildContextualName(metricName))
            .lowCardinalityKeyValues(tags)
            .observeChecked(function)
    }

    fun addMetricTags(tags: Map<String, String>) {
        observationRegistry.currentObservation?.also {
            val ctx = it.context
            ctx.addLowCardinalityKeyValues(buildKeyValues(tags))
        }
    }

    private fun buildKeyValues(tags: Map<String, String>): KeyValues =
        KeyValues.of(tags.map { buildKeyValue(it.key, it.value) })

    private fun buildKeyValue(key: String, value: String): KeyValue =
        KeyValue.of(key.lowercase(), getAtMaxWidthOrEmptyValueIfBlank(value))


    private fun buildContextualName(prefix: String): String =
        "$prefix.context"
}