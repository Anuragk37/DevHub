from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/notifications/<int:user_id>/', consumers.NotificationConsumer.as_asgi()),
    path('ws/teamchat/<int:team_id>/', consumers.TeamChatConsumer.as_asgi()),
    path('ws/communitychat/<int:community_id>/', consumers.CommunityChatConsumer.as_asgi()),
]