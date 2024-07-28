from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *
from django.shortcuts import get_object_or_404

# Create your views here.


class CommunityView(APIView):

    def post(self, request):
        creator = request.user
        mutable_data = request.data.copy()
        mutable_data["creator_id"] = creator.id
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
        serializer = CommunitySerializer(
            communities, many=True, context={"request": request}
        )
        return Response(serializer.data)

class CommunityDetailView(APIView):
    def get(self, request, community_id):
        try:
            community = get_object_or_404(Community, id=community_id)
            serializer = CommunitySerializer(community, context={"request": request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CommunityMemberView(APIView):
    def post(self, request):
        user = request.user
        community_id = request.data.get("community_id")

        try:
            community = get_object_or_404(Community, id=community_id)
            serializer = CommunityMemberSerializer(
                data={"community": community.id, "user": user.id}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Joined community successfully."},
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, community_id):
        try:
            community_members = CommunityMember.objects.filter(
                community_id=community_id
            )
            serializers = CommunityMemberSerializer(community_members, many=True, context={"request": request})
            return Response(serializers.data)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
