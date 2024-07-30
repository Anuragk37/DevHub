from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import *

# Create your views here.

class NotificationView(generics.ListAPIView):
   queryset = Notification.objects.all()
   serializer_class = NotificationSerializer

   def get_queryset(self):
      user = self.request.user
      return Notification.objects.filter(user=user)
   
class TeamChatView(generics.ListAPIView):
   serializer_class = TeamChatSerializer

   def get_queryset(self):
      team = self.kwargs.get('team_id')
      return TeamChat.objects.filter(team=team)

class CommunityChatView(generics.ListAPIView):
   serializer_class = CommunityChatSerializer

   def get_queryset(self):
      community = self.kwargs.get('community_id')
      return CommunityChat.objects.filter(community=community)