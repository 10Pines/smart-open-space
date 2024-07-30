package com.sos.smartopenspace.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.GenerationType
import jakarta.persistence.ManyToOne
import jakarta.validation.Valid
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

@Entity
class Review (

  @field:Valid
  @field:NotNull
  @field:Max(5)
  @field:Min(1)
  val grade: Int,

  @ManyToOne
  val reviewer: User,

  @Column(columnDefinition="VarChar")
  val comment: String?,

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  val id: Long = 0
)