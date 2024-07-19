from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CommunitySerializer
from .models import *

# Create your views here.

class CommunityView(APIView):

   def post(self, request):
      creator = request.user
      mutable_data = request.data.copy()
      mutable_data['creator_id'] = creator.id
      try:
         print(mutable_data)
         serializer = CommunitySerializer(data=mutable_data)
         if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
         print(serializer.errors)
         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      except Exception as e:
         print(e)
         return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
   
   def get(self, request):
      communities = Community.objects.all()
      serializer = CommunitySerializer(communities, many=True,context={'request': request})
      return Response(serializer.data)
   
   
