package com.sos.smartopenspace.sampler

import com.sos.smartopenspace.domain.Room
import java.net.URI

object RoomSampler {

    fun get(): Room = getWith()

    fun getWith(
        id: Long = 0L,
        name: String = "Conference Room",
        description: String = "A room for meetings",
        link: String = "http://example.com"
    ): Room = Room(
        id = id,
        name = name,
        description = description,
        link = URI.create(link).toURL()
    )
}