package com.sos.smartopenspace.domain

import java.net.URL

class MarketplaceTalk(
    override var name: String,
    override var description: String = "",
    override val id: Long = 0,
    override var meetingLink: URL? = null,
    override var track: Track? = null,
    override val documents: MutableSet<Document> = mutableSetOf(),
    override val reviews: MutableSet<Review> = mutableSetOf(),
    override var speaker: User,

    var is_marketplace_talk: Boolean = false,
    var speaker_name: String? = null
) : Talk(name, description, id, meetingLink, track, documents, reviews, speaker) {
}