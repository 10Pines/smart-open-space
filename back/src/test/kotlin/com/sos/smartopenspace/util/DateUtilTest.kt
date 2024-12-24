package com.sos.smartopenspace.util

import io.mockk.every
import io.mockk.mockkStatic
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.Clock
import java.time.Instant


class DateUtilTest {

    companion object {
        private const val INSTANT_NOW_DEFAULT = "2024-12-21T03:00:00.000Z"
    }

    @Test
    fun `test getNowUTC should be get instant now in UTC`() {
        val instant = Instant.parse(INSTANT_NOW_DEFAULT)
        mockkStatic(Instant::class)
        every { Instant.now(Clock.systemUTC()) } returns instant
        assertEquals(Instant.now(Clock.systemUTC()), getNowUTC())
    }


}