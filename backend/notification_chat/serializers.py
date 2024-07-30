from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer

class NotificationSerializer(serializers.ModelSerializer):
   class Meta:
      model = Notification
      fields = '__all__'
   
class TeamChatSerializer(serializers.ModelSerializer):
   sender = UserSerializer()
   class Meta:
      model = TeamChat
      fields = '__all__'

      # def __init__(self, *args, **kwargs):
      #   context = kwargs.pop('context', {})
      #   super().__init__(*args, **kwargs)
      #   self.context.update(context)

      # def to_representation(self, instance):
      #    self.fields['sender'].context.update(self.context)
      #    return super().to_representation(instance)


class CommunityChatSerializer(serializers.ModelSerializer):
   sender = UserSerializer()
   class Meta:
      model = CommunityChat
      fields = '__all__'