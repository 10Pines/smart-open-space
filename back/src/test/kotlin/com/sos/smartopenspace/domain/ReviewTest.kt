package com.sos.smartopenspace.domain

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class ReviewTest {

    @Test
    fun `test toString`() {
        val review = Review(
            id = 1,
            grade = 5,
            reviewer = User(
                id = 1,
                email = "sara@g.co",
                name = "Sara",
                password = "asd123",
            ),
            comment = "Great place",
        )

        val expectedRes = "Review(comment=Great place, grade=5, id=1, reviewer=User(email=sara@g.co, id=1, name=Sara, password=***, resetToken=***, resetTokenLifetime=***))"
        assertEquals(expectedRes, review.toString())
    }
}