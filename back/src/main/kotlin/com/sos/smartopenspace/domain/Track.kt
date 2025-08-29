package com.sos.smartopenspace.domain

import com.sos.smartopenspace.validators.HexColor
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size

@Entity
data class Track(
  @field:NotEmpty
  val name: String,

  @field:Size(max = 500)
  val description: String = "",

  @field:HexColor
  val color: String,

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  override var id: Long = 0
) : UpdatableItemCollection
