package com.sos.smartopenspace.domain

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.net.URI

class DocumentTest {

  @Test
  fun `test Document toString`() {
    val document = Document(
      id = 1,
      name = "document-test",
      link = URI.create("http://example.com/path-test").toURL(),
    )

    val expectedString = "Document(id=1, link=http://example.com/path-test, name=document-test)"
    assertEquals(expectedString, document.toString())
  }

  @Test
  fun `test Document init`() {
    val name = "document-test"
    val link = URI.create("http://example.com/path-test").toURL()
    val document = Document(
      name = name,
      link = link,
    )

    assertEquals(name, document.name)
    assertEquals(link, document.link)
  }

  @Test
  fun `test Document setters`() {
    val document = Document(
      name = "document-test",
      link = URI.create("http://example.com/path-test").toURL(),
    )

    val newName = "updated-document"
    val newLink = URI.create("http://example.com/updated-path").toURL()


    document.name = newName
    document.link = newLink
    assertEquals(newName, document.name)
    assertEquals(newLink, document.link)
    assertEquals(0, document.id)
  }


}