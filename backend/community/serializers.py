from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer

class CommunitySerializer(serializers.ModelSerializer):
   creator = UserSerializer(read_only=True)
   creator_id = serializers.PrimaryKeyRelatedField(source='creator', queryset=MyUser.objects.all(), write_only=True)
   profile_pic_url = serializers.SerializerMethodField(read_only=True)
   is_member = serializers.SerializerMethodField(read_only=True)
   member_count = serializers.SerializerMethodField(read_only=True)
   class Meta:
      model = Community
      fields = ['id', 'name', 'description', 'rules', 'creator', 'creator_id', 'created_date','profile_pic','profile_pic_url','is_member','member_count']

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
   
   def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CommunityMember.objects.filter(user=request.user, community=obj).exists()
        return False
   
   def get_member_count(self, obj):
        return CommunityMember.objects.filter(community=obj).count()


class CommunityMemberSerializer(serializers.ModelSerializer):
   user = serializers.PrimaryKeyRelatedField(queryset=MyUser.objects.all())
   community = serializers.PrimaryKeyRelatedField(queryset=Community.objects.all())
   class Meta:
      model = CommunityMember
      fields = ['id', 'user',  'community', 'joined_date']

   def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = UserSerializer(instance.user, context=self.context).data
        return representation

