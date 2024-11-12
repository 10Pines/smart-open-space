package com.sos.smartopenspace.domain

import com.sos.smartopenspace.util.toStringByReflex
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.GenerationType
import java.net.URL
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull

@Entity
class Document(
  @field:NotEmpty()
  var name: String,

  @Column(columnDefinition="VarChar")
  @field:NotNull
  var link: URL,

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  override val id: Long = 0
) : UpdatableItemCollection {

  override fun toString(): String =
      toStringByReflex(this)

}