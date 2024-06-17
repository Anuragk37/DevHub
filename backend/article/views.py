from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from .models import *
from .serializer import *

# Create your views here.

class ArticleView(generics.ListCreateAPIView):
   queryset=Article.objects.all()
   serializer_class= ArticleSerializer

   def post(self, request):
      title=request.data['title']
      content=request.data['content']
      thumbnail=request.data['thumbnail']
      auther_id=request.data['user']
      tags=request.data.get('tags')
      
      auther = MyUser.objects.get(id=auther_id)

      serializer = ArticleSerializer(data={'title':title,'content':content,'thumbnail':thumbnail,'auther':auther.id})
      if serializer.is_valid():
         article=serializer.save()

         return Response(serializer.data)
      
      print(serializer.errors)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
   queryset=Article.objects.all()
   serializer_class= ArticleSerializer



   
