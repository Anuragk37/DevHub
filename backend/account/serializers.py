from rest_framework import serializers
from .models import MyUser
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
   password = serializers.CharField(write_only=True) 
   class Meta:
      model = MyUser
      fields = ['id','username','fullname','email','phone_number','bio','password','profile_pic']

   def create(self, validated_data):
      user = MyUser.objects.create_user(**validated_data)
      return user

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