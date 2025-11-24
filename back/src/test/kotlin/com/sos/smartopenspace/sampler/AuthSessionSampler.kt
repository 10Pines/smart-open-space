package com.sos.smartopenspace.sampler

import com.sos.smartopenspace.domain.AuthSession
import com.sos.smartopenspace.domain.User
import java.time.Instant

object AuthSessionSampler {

  fun get(): AuthSession = getWith()

  fun getWith(
    id: String = "1234-12312441241-124124124",
    user: User = UserSampler.get(),
    tokenId: String = "some_token_id",
    revoked: Boolean = false,
    createdOn: Instant = Instant.parse("2024-12-01T00:00:00Z"),
    expiresOn: Instant = Instant.parse("2024-12-15T00:00:00Z"),
  ): AuthSession =
    AuthSession(
      id = id,
      user = user,
      tokenId = tokenId,
      revoked = revoked,
      createdOn = createdOn,
      expiresOn = expiresOn,
    )
}
