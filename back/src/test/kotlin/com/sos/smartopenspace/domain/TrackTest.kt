package com.sos.smartopenspace.domain

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Test

class TrackTest {

    @Test
    fun `test Track equals and hashCode should be equals`() {

        val track1 = Track(
            id = 1L,
            name = "Track 1",
            description = "Description for Track 1",
            color = "#FF5733"
        )
        val track1Copy = Track(
            id = 1L,
            name = "Track 1",
            description = "Description for Track 1",
            color = "#FF5733"
        )

        assertEquals(track1, track1)
        assertEquals(track1Copy, track1Copy)
        assertEquals(track1Copy, track1)
        assertEquals(track1, track1Copy)


        assertEquals(track1.hashCode(), track1Copy.hashCode())

    }

    @Test
    fun `test Track equals and hashCode should not be equals`() {
        val track1 = Track(
            id = 0L,
            name = "Track 1",
            description = "Description for Track 1",
            color = "#FF5733"
        )
        val tracksNotEquals: List<Any?> = listOf(
            null,
            Track(
                id = 1L,
                name = "Track 1",
                description = "Description for Track 1",
                color = "#FF5733"
            ),
            Track(
                id = 0L,
                name = "Other Track 1",
                description = "Description for Track 1",
                color = "#FF5733"
            ),
            Track(
                id = 0L,
                name = "Track 1",
                description = "Other Description for Track 1",
                color = "#FF5733"
            ),
            Track(
                id = 0L,
                name = "Track 1",
                description = "Description for Track 1",
                color = "#FFFFFF"
            ),
            Any()
        )

        tracksNotEquals.forEach {
            assertNotEquals(track1, it)
            assertNotEquals(it, track1)
            assertNotEquals(track1.hashCode(), it?.hashCode())
        }
    }
}