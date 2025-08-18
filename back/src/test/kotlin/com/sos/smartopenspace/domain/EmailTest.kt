package com.sos.smartopenspace.domain

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Test

class EmailTest {

  @Test
  fun `test email init`() {

    val to = "a@gmail.co"
    val subject = "Some subject"
    val text = """
            Some text
            with new line
        """
    val email = Email(
      to = to,
      subject = subject,
      text = text
    )

    assertEquals(to, email.to)
    assertEquals(subject, email.subject)
    assertEquals(text, email.text)
  }

  @Test
  fun `test email equals`() {

    val to = "a@gmail.co"
    val subject = "Some subject"
    val text = """
            Some text
            with new line
        """
    val email1 = Email(
      to = to,
      subject = subject,
      text = text
    )
    val email2 = Email(
      to = to,
      subject = subject,
      text = text
    )

    assertEquals(email1, email1)
    assertEquals(email1, email2)
    assertNotEquals(email1, null)
    assertNotEquals(null, email1)
  }
}