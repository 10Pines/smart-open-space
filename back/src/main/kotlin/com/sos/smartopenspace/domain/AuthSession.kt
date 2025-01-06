package com.sos.smartopenspace.domain

import com.sos.smartopenspace.util.toStringByReflex
import jakarta.persistence.*
import java.time.Instant

@Entity
class AuthSession(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String = "",
    @Column(unique = true, length = 455)
    val token: String,
    val createdOn: Instant,
    val expiresOn: Instant,
    var revoked: Boolean = false,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val user: User,
){
    fun revoke() {
        revoked = true
    }

    override fun toString(): String =
        toStringByReflex(
            this,
            mask = listOf("token"),
        )

}