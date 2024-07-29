from django.urls import path
from .views import*

urlpatterns = [
   path('notifications/', NotificationView.as_view()),
   path('teamchat/<int:team_id>/', TeamChatView.as_view()),
]