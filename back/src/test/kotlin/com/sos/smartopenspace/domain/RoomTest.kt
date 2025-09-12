package com.sos.smartopenspace.domain

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.net.URI

class RoomTest {

  @Test
  fun `test toString`() {
    val room = Room(
      name = "Conference Room",
      description = "A room for meetings",
      link = URI.create("http://example.com").toURL()
    )

    val expectedRes =
      "Room(description=A room for meetings, id=0, link=http://example.com, name=Conference Room)"
    assertEquals(expectedRes, room.toString())
  }

}
