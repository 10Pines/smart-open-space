package com.sos.smartopenspace.util

import java.time.Clock
import java.time.Instant

fun getNowUTC(): Instant = Instant.now(Clock.systemUTC())