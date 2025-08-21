package com.sos.smartopenspace.config

import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@Profile("prod")
class StaticFilesController {
  // TODO These routes are the ones used for routing in the frontend, if we add a new one we
  // should also add it here.
  @RequestMapping(
    value = [
      "/login/**",
      "/os/**",
      "/new/**",
      "/register/**",
      "/newTalk/**",
      "/manual",
    ],
  )
  fun redirect(): String = "forward:/"
}
