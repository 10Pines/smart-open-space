package com.sos.smartopenspace.dto.security

import com.sos.smartopenspace.domain.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserDetailsDTO(
  private val user: User
) : UserDetails {
  override fun getAuthorities(): Collection<GrantedAuthority> = listOf()
  override fun getPassword(): String = user.password
  override fun getUsername(): String = user.email
  override fun isAccountNonExpired() = true
  override fun isAccountNonLocked() = true
  override fun isCredentialsNonExpired() = true
  override fun isEnabled() = true
}
