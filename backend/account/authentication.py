from django.contrib.auth.backends import ModelBackend
from .models import MyUser

from django.db.models import Q


class AuthBackend(ModelBackend):
   def authenticate(self, request, identifier=None, password=None, **kwargs):
      try:
         user = MyUser.objects.get(
            Q(username=identifier) | Q(email=identifier) | Q(phone_number=identifier)
         )
         
      except MyUser.DoesNotExist:
         return None

      if user.check_password(password):
         return user
      return None