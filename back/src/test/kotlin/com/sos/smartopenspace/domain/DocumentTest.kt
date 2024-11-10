package com.sos.smartopenspace.domain

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.net.URI

class DocumentTest {

    @Test
    fun `test toString`() {
        val document = Document(
            id = 1,
            name = "document-test",
            link = URI.create("http://example.com/path-test").toURL(),
        )

        val expectedString = "Document(id=1, link=http://example.com/path-test, name=document-test)"
        assertEquals(expectedString, document.toString())
    }
}