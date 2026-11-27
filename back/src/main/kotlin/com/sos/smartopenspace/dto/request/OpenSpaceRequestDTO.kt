package com.sos.smartopenspace.dto.request

import com.sos.smartopenspace.domain.Room
import com.sos.smartopenspace.domain.Slot
import com.sos.smartopenspace.domain.Track
import jakarta.persistence.Column
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size
import java.time.LocalDate

data class OpenSpaceRequestDTO(
  @field:NotEmpty(message = "Ingrese un nombre")
  @field:NotBlank(message = "Nombre no puede ser vacío")
  val name: String,

  val dates: Set<LocalDate>,

  val rooms: Set<@Valid Room>,

  val slots: Set<@Valid Slot>,

  @field:Column(length = 1000)
  @field:Size(min = 0, max = 1000)
  val description: String = "",

  val tracks: Set<@Valid Track> = emptySet()
) {

  fun slotsWithDates(): List<Slot> {
    return slots.flatMap { slot ->
      dates.map { date ->
        slot.cloneWithDate(date)
      }
    }
  }

}
