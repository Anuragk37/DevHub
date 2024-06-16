from django.http import HttpResponse
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
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

    def get(self, request,pk=None):
        if pk:
            users = get_object_or_404(MyUser, pk=pk)
            serializer = UserSerializer(users)
            return Response(serializer.data)
        users = MyUser.objects.filter(is_superuser=False)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                  "message": "User created successfully",
                  "refreshToken": str(refresh),
                  "accessToken": str(refresh.access_token)}, 
                  status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        user = get_object_or_404(MyUser, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def put(self, request, pk):
        user = get_object_or_404(MyUser, pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
    
class UserSkillView(generics.ListCreateAPIView):
    queryset = MyUserSkill.objects.all()
    serializer_class = UserSkillSerializer

    def post(self, request):
        user_id = request.data.get('user_id')
        user=MyUser.objects.get(id=user_id)
        skills = request.data.get('selectedSkills',[])
        for skill in skills:
            skill = Skill.objects.get(id=skill['id'])
            serializers = UserSkillSerializer(data={'user': user.id, 'skill': skill.id})
            if serializers.is_valid():
                serializers.save()
                
            else:
                return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response( status=status.HTTP_201_CREATED)
    
class  UserTagView(generics.ListCreateAPIView):
    queryset = MyUserTag.objects.all()
    serializer_class = UserTagSerializer

    def post(self,request):
        user_id = request.data.get('user_id')
        user = MyUser.objects.get(id=user_id)
        tags = request.data.get('selectedTags',[])
        for tag in tags:
            tag = Tag.objects.get(id=tag['id'])
            serializers = UserTagSerializer(data={'user':user.id,'tag':tag.id})
            if serializers.is_valid():
                serializers.save()
            else:
                return Response(serializers.error,status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)
