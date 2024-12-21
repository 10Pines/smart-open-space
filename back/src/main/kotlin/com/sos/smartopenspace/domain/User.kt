package com.sos.smartopenspace.domain

import com.google.common.hash.Hashing
import com.sos.smartopenspace.util.toStringByReflex
import jakarta.persistence.*
import java.nio.charset.StandardCharsets
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

@Entity(name = "Users")
class User(
    @field:NotEmpty(message = "Ingrese un email")
    @field:Email
    @Column(unique = true)
    val email: String,

    @field:NotEmpty(message = "Ingrese un nombre")
    @field:NotBlank(message = "Nombre no puede ser vacío")
    val name: String,

    @field:NotEmpty(message = "Ingrese una contraseña")
    @field:NotBlank(message = "Contraseña no puede ser vacía")
    var password: String = "",

    var resetToken: String? = null,

    var resetTokenLifetime: Long? = null,

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    val authSessions: List<AuthSession> = listOf(),

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0
) {

    override fun toString(): String =
        toStringByReflex(
            this,
            mask = listOf("password", "resetToken", "resetTokenLifetime"),
            exclude = listOf("authSessions")
        )

    fun addOpenSpace(openSpace: OpenSpace): User {
        openSpace.organizer = this
        return this
    }

    fun checkOwnershipOf(openSpace: OpenSpace) {
        if (this != openSpace.organizer)
            throw UserNotOwnerOfOpenSpaceException()
    }

    fun checkOwnershipOf(talk: Talk) {
        if (!isOwnerOf(talk))
            throw UserNotOwnerOfTalkException()
    }

    fun isOwnerOf(talk: Talk) = this.id == talk.speaker.id

    fun secureResetToken(resetToken: String, lifetime: Long) {
        this.resetToken = secureField(resetToken)
        this.resetTokenLifetime = System.currentTimeMillis() + lifetime
    }

    fun cleanResetToken() {
        this.resetToken = null
        this.resetTokenLifetime = null
    }

    private fun secureField(field: String) = Hashing.sha256()
        .hashString(field, StandardCharsets.UTF_8)
        .toString()
}
