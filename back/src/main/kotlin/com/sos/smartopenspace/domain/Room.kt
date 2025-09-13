package com.sos.smartopenspace.domain

import com.sos.smartopenspace.util.toStringByReflex
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import java.net.URL

@Entity
class Room(
  @field:NotEmpty(message = "Ingrese un nombre")
  @field:NotBlank(message = "Nombre no puede ser vacío")
  val name: String,

  @Column(columnDefinition = "VarChar")
  val description: String = "",

  @Column(columnDefinition = "VarChar")
  var link: URL? = null,

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  override val id: Long = 0
) : UpdatableItemCollection {

  override fun toString(): String =
    toStringByReflex(this)
}
