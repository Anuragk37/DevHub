from django.db import models
from account.models import MyUser
from admin_panel.models import *

# Create your models here.

class Team(models.Model):
   name = models.CharField(max_length=100)
   creator = models.ForeignKey(MyUser, on_delete=models.CASCADE)
   created_date = models.DateTimeField(auto_now_add=True)
   description = models.TextField(blank=True)
   members_required = models.IntegerField(default=0)
   profile_pic = models.ImageField(upload_to='team_profile_pic/', blank=True, null=True)

   def __str__(self):
      return self.name

class TeamSkill(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='team_skills')
    
    

class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='teams')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('team', 'user')
   
class TeamInvitation(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='invitations')
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='team_invitations')
    invited_at = models.DateTimeField(auto_now_add=True)

    


class TeamInterest(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='interests')
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='team_interests')
    status = models.CharField(max_length=20, choices=(('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Rejected', 'Rejected')), default='Pending')
    expressed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('team', 'user')
