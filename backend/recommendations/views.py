from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .recommendation import recommend_articles
from article.serializer import ArticleSerializer

# Create your views here.

class RecommendationView(APIView):
   def get(self, request):
      user_id = request.user.id
      recommended_articles = recommend_articles(user_id)


      serializer = ArticleSerializer(recommended_articles, many=True, context={'request': request})

      return Response(serializer.data)
