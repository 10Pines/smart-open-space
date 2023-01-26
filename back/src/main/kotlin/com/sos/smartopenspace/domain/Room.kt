package com.sos.smartopenspace.domain

import java.net.URL
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty

@Entity
class Room(
  @field:NotEmpty(message = "Ingrese un nombre")
  @field:NotBlank(message = "Nombre no puede ser vacío")
  val name: String,

  @Column(columnDefinition="VarChar")
  val description: String = "",

  @Column(columnDefinition="VarChar")
  var link: URL? = null,

  @Id @GeneratedValue
  val id: Long = 0
)
