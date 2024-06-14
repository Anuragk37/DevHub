from rest_framework import serializers
from .models import MyUser


class UserSerializer(serializers.ModelSerializer):
   password = serializers.CharField(write_only=True) 
   class Meta:
      model = MyUser
      fields = ['id','username','fullname','email','phone_number','bio','password','profile_pic']

   def create(self, validated_data):
      user = MyUser.objects.create_user(**validated_data)
      return user