package com.sos.smartopenspace.util

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset


class DateUtilTest {

    companion object {
        private const val INSTANT_NOW_DEFAULT = "2024-12-21T03:00:00.000Z"
    }

    @Test
    fun `test getNowByClock should be get instant now from expected clock`() {
        val fixedInstant = Instant.parse(INSTANT_NOW_DEFAULT)
        val fixedClock = Clock.fixed(fixedInstant, ZoneOffset.UTC)

        assertEquals(fixedInstant, getNowByClock(fixedClock))
    }


}