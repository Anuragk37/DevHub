from django.db import models
from account.models import MyUser

# Create your models here.

class Notification(models.Model):
   user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
   message = models.TextField()
   created_at = models.DateTimeField(auto_now_add=True)
   is_read = models.BooleanField(default=False)

   def __str__(self):
      return f"{self.user.username} - {self.message[:50]}"