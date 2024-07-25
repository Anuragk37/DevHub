from django.http import HttpResponse
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.test import APIRequestFactory

from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import send_email
from django.conf import settings
import random
import redis
from django.core.cache import cache
from admin_panel.serializers import SkillSerializer
from django.contrib.auth import authenticate
from team.models import *


import smtplib
from email.mime.text import MIMEText
# Create your views here.

# class UserListCreateView(generics.ListCreateAPIView):   
#    queryset = MyUser.objects.all()
#    serializer_class = UserSerializer

#    def create(self,request, *args, **kwargs):
#       serializer=self.get_serializer(data=request.data)

#       if serializer.is_valid():
#          serializer.save()
#          return Response(serializer.data, status=status.HTTP_201_CREATED)

#       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

class UserView(APIView):
    def get(self, request, pk=None):
        if pk:
            user = get_object_or_404(MyUser, pk=pk)
            serializer = UserSerializer(user, context={'request': request})
            return Response(serializer.data)
        users = MyUser.objects.filter(is_superuser=False)
        serializer = UserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                user = serializer.save()
                return send_otp(user.email, is_signup=True)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        user = get_object_or_404(MyUser, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def put(self, request, pk):
        user = get_object_or_404(MyUser, pk=pk)
        serializer = UserSerializer(user, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self, request, pk):
        try:
            user = get_object_or_404(MyUser, pk=pk)
            serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    
    def patch(self, request, pk):
        try:
            user = get_object_or_404(MyUser, pk=pk)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_serializer_context(self):
        return {'request': self.request}

def send_otp(email, is_signup=False):
    try:
        otp = random.randint(1000, 9999)
        subject = "DevHub OTP"
        message = f"Your OTP is {otp}"
        to_email = email
        
        send_email(to_email,subject, message)
        cache.set(email,otp,timeout=120) 
        if is_signup:
            return Response({"message": "Your account is created successfully. Verify your email"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": f"Failed to send OTP: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def resend_otp(request):
    email = request.data.get('email')
    return send_otp(email)

@api_view(['POST'])
def verify_otp(request):
    email=request.data.get('email')
    otp = request.data.get('otp')
    is_signup = request.data.get('is_signup', False)  
    stored_otp = cache.get(email)
    print("stored_otp",stored_otp,otp,email)
    if stored_otp is None or stored_otp != int(otp):
        return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = MyUser.objects.get(email=email)
        user.is_verified = True
        id=user.id
        user.save()
        cache.delete(email)

        if is_signup:

            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "User logged in successfully",
                "user_id": id,
                "refreshToken": str(refresh),
                "accessToken": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        
        return Response({"message": "OTP verified"}, status=status.HTTP_200_OK)
    
    except MyUser.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message": f"Failed to verify OTP: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if  serializer.is_valid():
            user=serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                  "message": "User logged in successfully",
                  "refreshToken": str(refresh),
                  "accessToken": str(refresh.access_token)}, 
                  status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    new_password = request.data.get('password')
    try:
        user = MyUser.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
    except MyUser.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message": f"Failed to reset password: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserSkillView(generics.ListCreateAPIView):
    queryset = MyUserSkill.objects.all()
    serializer_class = UserSkillSerializer

    def post(self, request):
        user_id = request.data.get('user_id')
        user = MyUser.objects.get(id=user_id)
        skills = request.data.get('selectedSkills', [])

        for skill_data in skills:
            skill = Skill.objects.get(id=skill_data['id'])
            serializer = UserSkillSerializer(data={'user': user.id, 'skill': skill.id})

            if serializer.is_valid():
                serializer.save()
                teams = TeamSkill.objects.filter(skill=skill).select_related('team')

                for team_skill in teams:
                    team = team_skill.team
                    TeamInvitation.objects.create(user=user, team=team)

            else:
                return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response( status=status.HTTP_201_CREATED)

    def get_queryset(self):
        user_id = self.kwargs['user_id'] 
        user = MyUser.objects.get(id=user_id)
        user_skills = MyUserSkill.objects.filter(user=user).select_related('skill')
        skills = [user_skill.skill for user_skill in user_skills]
        return skills
    
    def list(self, request, *args, **kwargs):
        skills = self.get_queryset()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    
class  UserTagView(generics.ListCreateAPIView):
    queryset = MyUserTag.objects.all()
    serializer_class = UserTagSerializer

    def post(self, request):
        user_id = request.data.get('user_id')
        tags_to_add = request.data.get('tagsToAdd', [])
        tags_to_remove = request.data.get('tagsToRemove', [])

        try:
            user = MyUser.objects.get(id=user_id)
        except MyUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        for tag in tags_to_remove:
            MyUserTag.objects.filter(user=user, tag_id=tag['id']).delete()

        for tag in tags_to_add:
            tag_obj, created = Tag.objects.get_or_create(id=tag['id'])
            serializers = UserTagSerializer(data={'user': user.id, 'tag': tag_obj.id})
            if serializers.is_valid():
                serializers.save()
            else:
                return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Tags updated successfully"}, status=status.HTTP_200_OK)
    
    def get_queryset(self):
        user = self.kwargs['user_id']
        user_tags = MyUserTag.objects.filter(user=user).select_related('tag')
        tags = [user_tag.tag for user_tag in user_tags]
        return tags

    def list(self, request, *args, **kwargs):
        tags = self.get_queryset()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

class RelationshipView(APIView):
    def post(self, request):
        follower = request.user
        following_id = request.data.get('following_id')
        following = MyUser.objects.get(id=following_id)

        if follower == following:
            return Response({"message": "You can't follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

        relationship = Relationship.objects.filter(follower=follower, following=following).first()
        if relationship:
            relationship.delete()
            return Response({"detail": "Successfully unfollowed."}, status=status.HTTP_204_NO_CONTENT)
        else:
            relationship = Relationship.objects.create(follower=follower, following=following)
            serializer = RelationshipSerializer(relationship)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserFollowersView(APIView):
    def get(self, request, user_id):
        try:
            user = MyUser.objects.get(id=user_id)
        except MyUser.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        followers = Relationship.objects.filter(following=user).select_related('follower')

        followers_users = [relationship.follower for relationship in followers]
        serializer = UserSerializer(followers_users, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserFollowingView(APIView):
    def get(self, request, user_id):
        try:
            user = MyUser.objects.get(id=user_id)
        except MyUser.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        following = Relationship.objects.filter(follower=user).select_related('following')
        following_users = [relationship.following for relationship in following]
        serializer = UserSerializer(following_users, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    



