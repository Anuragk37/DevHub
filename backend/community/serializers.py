from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer

class CommunitySerializer(serializers.ModelSerializer):
   creator = UserSerializer(read_only=True)
   creator_id = serializers.PrimaryKeyRelatedField(source='creator', queryset=MyUser.objects.all(), write_only=True)
   profile_pic_url = serializers.SerializerMethodField(read_only=True)
   class Meta:
      model = Community
      fields = ['id', 'name', 'description', 'rules', 'creator', 'creator_id', 'created_date','profile_pic','profile_pic_url']

   def create(self, validated_data):
      try:
         creator_id = validated_data.pop('creator')
         creator = MyUser.objects.get(id=creator_id.id)
         community = Community.objects.create(creator=creator, **validated_data)
         return community
      except Exception as e:
         print(e)
   
   def get_profile_pic_url(self, obj):
        request = self.context.get('request')
        if request and obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None


