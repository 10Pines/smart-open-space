package com.sos.smartopenspace.sampler

import com.sos.smartopenspace.domain.AssignedSlot
import com.sos.smartopenspace.domain.OpenSpace
import com.sos.smartopenspace.domain.Room
import com.sos.smartopenspace.domain.Slot
import com.sos.smartopenspace.domain.Talk
import com.sos.smartopenspace.domain.Track
import com.sos.smartopenspace.domain.User

object OpenSpaceSampler {

  fun get() = getWith()

  fun getWith(
    id: Long = 10L,
    name: String = "New Open Space",
    description: String = "This is a sample open space description.",
    urlImage: String = "https://example.com/image.png",
    rooms: MutableSet<Room> = mutableSetOf(),
    slots: MutableSet<Slot> = mutableSetOf(),
    talks: MutableSet<Talk> = mutableSetOf(),
    tracks: MutableSet<Track> = mutableSetOf(),
    organizer: User = UserSampler.get(),
    assignedSlots: MutableSet<AssignedSlot> = mutableSetOf(),
    isActiveVoting: Boolean = false,
    isShowSpeakerName: Boolean = false,
    toScheduleTalks: MutableSet<Talk> = mutableSetOf(),
    queueTalks: MutableList<Talk> = mutableListOf()
  ): OpenSpace = OpenSpace(
    id = id,
    name = name,
    description = description,
    rooms = rooms,
    slots = slots,
    talks = talks,
    tracks = tracks,
    urlImage = urlImage,
  ).let {
    it.showSpeakerName = isShowSpeakerName
    it.isActiveVoting = isActiveVoting
    it.assignedSlots.addAll(assignedSlots)
    it.toSchedule.addAll(toScheduleTalks)
    it.queue.addAll(queueTalks)
    it.organizer = organizer


    organizer.addOpenSpace(it)
    it
  }

}