package com.sos.smartopenspace.config

import com.sos.smartopenspace.websockets.QueueSocket
import com.sos.smartopenspace.websockets.ScheduleSocket
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@EnableWebSocket
class WebSocketConfig(
  private val scheduleSocket: ScheduleSocket,
  private val queueSocket: QueueSocket,
  private val corsProps: CorsProps
) : WebSocketConfigurer {
  override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
    registry
      .addHandler(scheduleSocket, "/scheduleSocket")
      .setAllowedOrigins(*corsProps.corsSocketOrigins())
      .withSockJS()
    registry
      .addHandler(queueSocket, "/queueSocket")
      .setAllowedOrigins(*corsProps.corsSocketOrigins())
      .withSockJS()
  }
}
