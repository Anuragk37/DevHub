import json

from channels.generic.websocket import AsyncWebsocketConsumer
from .models import*
from .serializers import*


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f'notifications_{self.user_id}'  
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket connected for user {self.user_id}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"WebSocket disconnected for user {self.user_id}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        print(f"Received message: {message}")  # Debug print

    async def send_notification(self, event):
        message = event['message']
        print(f"Sending notification: {message}") 
        await self.send(text_data=json.dumps({
            'message': message
        }))