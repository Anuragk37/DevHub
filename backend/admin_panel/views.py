from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AdminLoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

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