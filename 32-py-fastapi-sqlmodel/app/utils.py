import smtplib

import emails

from app.core.config import settings


def send_email(*, email_to: str, subject: str, html_content: str) -> None:
    message = emails.message.Message(
        subject=subject, html=html_content, mail_from=("App", settings.EMAILS_FROM)
    )
    # The SMTP server is whatever the settings give at run time.
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT, "tls": True}
    message.send(to=email_to, smtp=smtp_options)


def send_alert(text: str) -> None:
    # The operators' relay is stated in the code.
    with smtplib.SMTP("smtp.ops.example.com", 25) as server:
        server.sendmail(settings.EMAILS_FROM, ["ops@example.com"], text)
