from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AdminLoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from .models import Skill,Tag
from .serializers import SkillSerializer,TagSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from account.models import MyUser
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from article.models import *
from community.models import *
from team.models import *
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count



# Create your views here.

class AdminLoginView(APIView):
   def post(self,request):
      serializer=AdminLoginSerializer(data=request.data)
      if serializer.is_valid():
         admin=serializer.validated_data['user']
         refreshToken=RefreshToken.for_user(admin)
         return Response({
            "message": "Admin logged in successfully",
            "refreshToken": str(refreshToken),
            "accessToken": str(refreshToken.access_token)            
         },status=status.HTTP_200_OK)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SkillView(generics.ListCreateAPIView):
   queryset = Skill.objects.all()
   serializer_class = SkillSerializer

   def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'message': "skill already exist"}, status=status.HTTP_400_BAD_REQUEST)

class SkillRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
   queryset = Skill.objects.all()
   serializer_class = SkillSerializer
   

class TagView(generics.ListCreateAPIView):
   queryset = Tag.objects.all()
   serializer_class = TagSerializer

   def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'message': "tag already exist"}, status=status.HTTP_400_BAD_REQUEST)

class TagRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
   queryset = Tag.objects.all()
   serializer_class = TagSerializer

@api_view(['POST'])
def blockUser(request,pk):
   user = get_object_or_404(MyUser, pk=pk)
   user.is_active = False
   user.save()
   return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def unblockUser(request,pk):
   user = get_object_or_404(MyUser, pk=pk)
   user.is_active = True
   user.save()
   return Response(status=status.HTTP_204_NO_CONTENT)



class AdminDashBoardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        past_month = now - timedelta(days=30)

        user_count = MyUser.objects.count()
        article_count = Article.objects.count()
        community_count = Community.objects.count()
        team_count = Team.objects.count()

        # User and Article data over the past month
        users_by_date = MyUser.objects.filter(date_joined__gte=past_month).extra({'date': "date(date_joined)"}).values('date').annotate(count=Count('id')).order_by('date')
        articles_by_date = Article.objects.filter(create_at__gte=past_month).extra({'date': "date(create_at)"}).values('date').annotate(count=Count('id')).order_by('date')

        return Response({
            "user_count": user_count,
            "article_count": article_count,
            "community_count": community_count,
            "team_count": team_count,
            "users_by_date": users_by_date,
            "articles_by_date": articles_by_date,
        })