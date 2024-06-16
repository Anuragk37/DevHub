from rest_framework import serializers
from account.models import MyUser
from .models import Skill,Tag
from django.contrib.auth import authenticate

class AdminLoginSerializer(serializers.Serializer):
   identifier = serializers.CharField()
   password = serializers.CharField()

   def validate(self, data):
      identifier = data.get('identifier')
      password = data.get('password')
      print(password,identifier)
      if identifier and password:
         user=authenticate(identifier=identifier, password=password)
         if user:
            if user.is_superuser:
               data['user'] = user
            else:
               raise serializers.ValidationError('user not admin')
         else:
            raise serializers.ValidationError('invalid credentials')
      else:
         raise serializers.ValidationError('creadientials required')
      
      return data


class SkillSerializer(serializers.ModelSerializer):
   class Meta:
      model = Skill
      fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
   class Meta:
      model = Tag
      fields = '__all__'