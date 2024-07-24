from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from admin_panel.serializers import SkillSerializer,TagSerializer
from admin_panel.models import Skill,Tag


class UserSerializer(serializers.ModelSerializer):
   password = serializers.CharField(write_only=True) 
   date_joined = serializers.SerializerMethodField()
   is_following = serializers.SerializerMethodField()
   followers_count = serializers.SerializerMethodField()
   following_count = serializers.SerializerMethodField()
   class Meta:
      model = MyUser
      fields = ['id','username','fullname','email','phone_number','bio','about','date_joined','password','profile_pic','is_active','is_verified','is_following', 'followers_count', 'following_count']

   def create(self, validated_data):
      user = MyUser.objects.create_user(**validated_data)
      return user
   

   def get_date_joined(self, obj):
      return obj.date_joined.date()
   
   def get_is_following(self, obj):
      request = self.context.get('request')
      if request and request.user.is_authenticated:
         return Relationship.objects.filter(follower=request.user, following=obj).exists()
      return False
   
   def get_followers_count(self, obj):
      return obj.following.count()

   def get_following_count(self, obj):
      return obj.follower.count()

class UserLoginSerializer(serializers.Serializer):
   identifier = serializers.CharField()
   password = serializers.CharField()

   def validate(self, data):
      identifier = data.get('identifier')
      password = data.get('password')

      if identifier and password:
         user=authenticate(identifier=identifier, password=password)
         if user:
            if user.is_active:    
               data['user'] = user
            else:
               raise serializers.ValidationError('user not active')
         else:
            raise serializers.ValidationError('invalid credentials')
      else:
         raise serializers.ValidationError('creadientials required')
      
      return data
   
class UserSkillSerializer(serializers.ModelSerializer):
   user = UserSerializer
   skill = SkillSerializer
   class Meta:
      model = MyUserSkill
      fields = "__all__"
   
   def create(self, validated_data):
      user_data = validated_data.pop('user')
      skill_data = validated_data.pop('skill')

      user_id = user_data.id
      skill_id = skill_data.id

      user = MyUser.objects.get(id=user_id)
      skill = Skill.objects.get(id=skill_id)
      
      user_skill = MyUserSkill.objects.create(user=user, skill=skill)

      return user_skill

class UserTagSerializer(serializers.ModelSerializer):
   user = UserSerializer
   tag= TagSerializer
   class Meta:
      model = MyUserTag
      fields = '__all__'
   
   def create(self,validated_data):
      user_data=validated_data.pop('user')
      tag_data = validated_data.pop('tag')

      user_id = user_data.id
      tag_id = tag_data.id

      user = MyUser.objects.get(id=user_id)
      tag = Tag.objects.get(id=tag_id)

      user_tag = MyUserTag.objects.create(user=user,tag=tag)

      return user_tag
   

class RelationshipSerializer(serializers.ModelSerializer):
   follower = UserSerializer()
   following = UserSerializer()
   class Meta:
        model = Relationship
        fields = ['follower', 'following', 'created_at']
        read_only_fields = ['created_at']
