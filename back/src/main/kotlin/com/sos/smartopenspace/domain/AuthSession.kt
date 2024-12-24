package com.sos.smartopenspace.domain

import jakarta.persistence.*
import java.time.Instant

@Entity
class AuthSession(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String = "",
    @Column(unique = true)
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
}