from django.shortcuts import render
from rest_framework import generics
from .models import Notification
from .serializers import NotificationSerializer

# Create your views here.

class NotificationView(generics.ListAPIView):
   queryset = Notification.objects.all()
   serializer_class = NotificationSerializer

   def get_queryset(self):
      user = self.request.user
      return Notification.objects.filter(user=user)
