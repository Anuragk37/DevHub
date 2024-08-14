from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .recommendation import recommend_articles, recommend_users
from article.serializer import ArticleSerializer
from account.models import MyUser
from account.serializers import UserSerializer

# Create your views here.

class RecommendationView(APIView):
   def get(self, request):
      user_id = request.user.id
      recommended_articles = recommend_articles(user_id)


      serializer = ArticleSerializer(recommended_articles, many=True, context={'request': request})

      return Response(serializer.data)
   

class UserRecommendationView(APIView):
   def get(self, request):
      user_id = request.user.id
      recommendations = recommend_users(user_id)
      recommended_users = MyUser.objects.filter(id__in=recommendations)

      serializer = UserSerializer(recommended_users, many=True, context={'request': request})

      return Response(status=status.HTTP_200_OK, data=serializer.data)
