from django.core.mail import EmailMessage
from django.conf import settings

def send_email(email,subject,message):
   email = EmailMessage(subject, message,from_email=settings.EMAIL_HOST_USER , to=[email])
   print("yes it is goin",subject)
   email.send()