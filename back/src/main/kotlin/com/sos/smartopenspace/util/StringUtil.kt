package com.sos.smartopenspace.util

import kotlin.reflect.full.memberProperties

fun toStringByReflex(
    obj: Any?,
    exclude: List<String> = listOf(),
    mask: List<String> = listOf()
): String {
    if (obj == null) {
        return "null"
    }
    val maskValue = "***"
    val propsString = obj::class.memberProperties
        .filter { !exclude.contains(it.name) }
        .sortedBy { it.name }
        .joinToString(", ") {
            val value =
                if (mask.isNotEmpty() && mask.contains(it.name)) maskValue
                else it.getter.call(obj).toString()
            "${it.name}=${value}"
        }
    return "${obj::class.simpleName}(${propsString})"
}