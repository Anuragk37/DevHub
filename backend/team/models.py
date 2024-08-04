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
   github_link = models.URLField(max_length=200, blank=True, null=True) 
   other_link = models.URLField(max_length=200, blank=True, null=True) 

   def __str__(self):
      return self.name

class TeamSkill(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='team_skills')
    
    

class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='teams')
    role = models.CharField(max_length=100,default='')
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


class Task(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='tasks')
    assigned_to = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='tasks')
    task = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.task}" if len(self.task) < 20 else self.task[:20]
