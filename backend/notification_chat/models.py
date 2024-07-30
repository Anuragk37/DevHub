from django.db import models
from account.models import MyUser
from team.models import Team
from community.models import Community

# Create your models here.

class Notification(models.Model):
   user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
   message = models.TextField()
   created_at = models.DateTimeField(auto_now_add=True)
   is_read = models.BooleanField(default=False)

   def __str__(self):
      return f"{self.user.username} - {self.message[:50]}"


class TeamChat(models.Model):
   team = models.ForeignKey(Team, on_delete=models.CASCADE)
   sender = models.ForeignKey(MyUser, on_delete=models.CASCADE)
   message = models.TextField()
   created_at = models.DateTimeField(auto_now_add=True)

   def __str__(self):
      return f"{self.sender.username} - {self.message[:50]}"

class CommunityChat(models.Model):
   community = models.ForeignKey(Community, on_delete=models.CASCADE)
   sender = models.ForeignKey(MyUser, on_delete=models.CASCADE)
   message = models.TextField()
   created_at = models.DateTimeField(auto_now_add=True)

   def __str__(self):
      return f"{self.sender.username} - {self.message[:50]}"