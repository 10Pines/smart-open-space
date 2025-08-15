package com.sos.smartopenspace.domain

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.sos.smartopenspace.util.toStringByReflex
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Inheritance
import jakarta.persistence.InheritanceType
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToOne
import java.time.LocalDate
import java.time.LocalTime

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes(
    Type(value = TalkSlot::class),
    Type(value = OtherSlot::class)
)
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
abstract class Slot(
    val startTime: LocalTime,

    val endTime: LocalTime,

    val date: LocalDate,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    override val id: Long = 0
) : UpdatableItemCollection {
    abstract fun isAssignable(): Boolean
    abstract fun cloneWithDate(date: LocalDate): Slot

    override fun toString(): String =
        toStringByReflex(this)
}

@Entity
class TalkSlot(
    startTime: LocalTime,
    endTime: LocalTime,
    date: LocalDate,
    id: Long = 0
) : Slot(startTime, endTime, date, id) {
    override fun isAssignable() = true
    override fun cloneWithDate(date: LocalDate): Slot {
        return TalkSlot(startTime, endTime, date)
    }
}

@Entity
class OtherSlot(
    val description: String,
    startTime: LocalTime,
    endTime: LocalTime,
    date: LocalDate,
    id: Long = 0
) : Slot(startTime, endTime, date, id) {
    override fun isAssignable() = false
    override fun cloneWithDate(date: LocalDate): Slot {
        return OtherSlot(
            startTime = startTime,
            endTime = endTime,
            description = description,
            date = date
        )
    }
}

@Entity
class AssignedSlot(
    @ManyToOne
    var slot: TalkSlot,
    @ManyToOne
    var room: Room,
    @OneToOne
    val talk: Talk,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
) {
    fun startAt(time: LocalTime) = slot.startTime == time

    fun moveTo(slot: TalkSlot, room: Room) {
        this.slot = slot
        this.room = room
    }

    fun hasDate(date: LocalDate?): Boolean {
        return slot.date == date
    }

    override fun toString(): String =
        toStringByReflex(this)
}
