import json

from channels.generic.websocket import AsyncWebsocketConsumer
from .models import*
from .serializers import*
from channels.db import database_sync_to_async
from django.core.serializers.json import DjangoJSONEncoder
from community.models import*



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

class TeamChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.team_id = self.scope['url_route']['kwargs']['team_id']
        self.room_group_name = f'chat_{self.team_id}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket connected for team {self.team_id}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"WebSocket disconnected for team {self.team_id}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        user = self.scope['user']
        team = await self.get_team(self.team_id)

        chat_message = await self.create_chat_message(team, user, message)
        chat_message['sender']['date_joined'] = chat_message['sender']['date_joined'].isoformat()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': chat_message['message'],
                'id': chat_message['id'],
                'sender': chat_message['sender'],
                'timestamp': chat_message['created_at'],
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'message': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def get_team(self, team_id):
        return Team.objects.get(id=team_id)

    @database_sync_to_async
    def create_chat_message(self, team, user, message):
        chat_message = TeamChat.objects.create(team=team, sender=user, message=message)
        return TeamChatSerializer(chat_message).data
    

class CommunityChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.community_id = self.scope['url_route']['kwargs']['community_id']
        self.room_group_name = f'community_chat_{self.community_id}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket connected for community {self.community_id}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        user = self.scope['user']
        community = await self.get_community(self.community_id)

        chat_message = await self.create_community_chat(community, user, message)
        chat_message['sender']['date_joined'] = chat_message['sender']['date_joined'].isoformat()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': chat_message['message'],
                'id': chat_message['id'],
                'sender': chat_message['sender'],
                'timestamp': chat_message['created_at'],
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'message': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def get_community(self, community_id):
        return Community.objects.get(id=community_id)

    @database_sync_to_async
    def create_community_chat(self, community, user, message):
        chat_message = CommunityChat.objects.create(community=community, sender=user, message=message)
        return CommunityChatSerializer(chat_message).data
    

