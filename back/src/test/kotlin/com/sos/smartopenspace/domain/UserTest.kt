package com.sos.smartopenspace.domain;

import com.sos.smartopenspace.sampler.TalkSampler
import com.sos.smartopenspace.sampler.UserSampler
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test


class UserTest {

  @Test
  fun `GIVEN user1 and talk with speaker user1 WHEN user1 isOwnerOf that talk THEN should be return truthy`() {
    val user = UserSampler.getWith(id = 1)
    val talk = TalkSampler.getWith(speaker = user)

    assertTrue(user.isOwnerOf(talk))
  }

  @Test
  fun `GIVEN user1 and talk with speaker user2 WHEN user1 isOwnerOf that talk THEN should be return falsy`() {
    val user1 = UserSampler.getWith(id = 1)
    val user2 = UserSampler.getWith(id = 2)
    val talk = TalkSampler.getWith(speaker = user2)

    assertFalse(user1.isOwnerOf(talk))
  }

  @Test
  fun `test user toString without sensitive data (password, etc)`() {
    val email1 = "asd@gmail.com"
    val name1 = "asd123"
    val id1 = 1L

    val email2 = "pepe@gmail.com"
    val name2 = "pepe"
    val id2 = 1123L

    val user1 = User(
      email = email1,
      name = name1,
      password = "123",
      id = id1,
      resetToken = "123312312312",
      resetTokenLifetime = 1232131
    )
    val user2 = User(
      email = email2,
      name = name2,
      password = "123",
      id = id2,
      resetToken = "123312312312",
      resetTokenLifetime = 1232131
    )

    assertEquals(
      "User(email=$email1, id=$id1, name=$name1, password=***, resetToken=***, resetTokenLifetime=***)",
      user1.toString()
    )
    assertEquals(
      "User(email=$email2, id=$id2, name=$name2, password=***, resetToken=***, resetTokenLifetime=***)",
      user2.toString()
    )
  }

  //TODO: Add more domain method tests

}
