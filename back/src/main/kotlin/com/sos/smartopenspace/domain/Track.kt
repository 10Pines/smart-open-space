package com.sos.smartopenspace.domain

import com.sos.smartopenspace.Validators.HexColor
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.Size

@Entity
class Track(
    @field:NotEmpty
    val name: String,

    @field:Size(max=500)
    val description: String = "",

    @field:HexColor
    val color: String,
    @Id
    @GeneratedValue
    var id: Long = 0
) {
}