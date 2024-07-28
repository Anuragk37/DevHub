from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification
from .serializers import NotificationSerializer

def send_notification(user, message):
    notification =  Notification.objects.create(user=user, message=message)
    serializer = NotificationSerializer(notification)
    
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_{user.id}",  
        {
            'type': 'send_notification',
            'message': serializer.data
        }
    )
    print(f"Notification sent to user {user.id}: {message}")