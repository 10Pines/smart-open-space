package com.sos.smartopenspace.services

import com.sos.smartopenspace.domain.Email
import jakarta.mail.Message
import jakarta.mail.internet.InternetAddress
import org.intellij.lang.annotations.Language
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(
  private val userService: UserService,
  private val emailSender: JavaMailSender
) {

  @Value("\${mail.sender}")
  private val mailSender: String = ""

  @Value("\${frontend.url}")
  private val frontendResetUrl: String = ""

  private val emailSubjectPrefix = "[Smart Open Space]"

  fun sendRecoveryEmail(email: String) =
    userService.findByEmail(email).also {
      val resetToken = userService.generatePasswordResetToken(it)
      sendEmail(
        email,
        "$emailSubjectPrefix Recuperación de contraseña",
        recoveryEmailContent(email, resetToken)
      )
    }
      .also { LOGGER.info("Send recovery email successfully with $email and user id ${it.id}") }

  @Language("HTML")
  private fun recoveryEmailContent(email: String, resetToken: String) =
    """
        <html>
          <p>
            ¡Hola! Nos llegó una solicitud para restablecer la contraseña de tu cuenta de Smart Open Space asociada a este correo.
          </p>

          <p>
            Para restablecerla, continúa desde el siguiente enlace: <a href="$frontendResetUrl/login?reset=true&email=$email&token=$resetToken">Restablecer contraseña</a>
          </p>

          <p>
            Si no fuiste tú, puedes ignorar con tranquilidad este correo.
          </p>
        </html>
      """

  private fun sendEmail(email: String, subject: String, text: String) =
    Email(email, subject, text).let {
      val msg = createMessage(it)
      emailSender.send(msg)
    }

  private fun createMessage(email: Email) =
    emailSender.createMimeMessage().apply {
      setFrom(mailSender)
      setRecipient(Message.RecipientType.TO, InternetAddress(email.to))
      subject = email.subject
      setText(email.text, "UTF-8", "html")
      setHeader("Content-Type", "text/html; charset=UTF-8")
    }

  companion object {
    private val LOGGER = LoggerFactory.getLogger(this::class.java)
  }
}
