from django.db import models
from account.models import MyUser

# Create your models here.

class Community(models.Model):
   name = models.CharField(max_length=250)
   description = models.TextField()
   rules = models.TextField()
   creator = models.ForeignKey(MyUser,on_delete=models.CASCADE)
   created_date = models.DateTimeField(auto_now_add=True)
   profile_pic = models.ImageField(upload_to='community_profile_pic/', blank=True, null=True)


   def __str__(self) -> str:
      return self.name

class CommunityMember(models.Model):
   user = models.ForeignKey(MyUser,on_delete=models.CASCADE)
   community = models.ForeignKey(Community,on_delete=models.CASCADE)
   joined_date = models.DateTimeField(auto_now_add=True)

   def __str__(self) -> str:
      return self.user.username


