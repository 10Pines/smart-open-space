package com.sos.smartopenspace.util

import java.time.Clock
import java.time.Instant

fun getNowByClock(clock: Clock = Clock.systemUTC()): Instant =
  Instant.now(clock)

fun getNowUTC(): Instant =
  getNowByClock()
