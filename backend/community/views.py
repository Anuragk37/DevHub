from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *
from django.shortcuts import get_object_or_404
from rest_framework import generics

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
        user = request.user
        communities = Community.objects.exclude(communitymember__user=user)
        serializer = CommunitySerializer(
            communities, many=True, context={"request": request}
        )
        return Response(serializer.data)
    
    def delete(self, request, community_id):
        try:
            community = get_object_or_404(Community, id=community_id)
            community.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


# class CommunityDetailView(APIView):
#     def get(self, request, community_id):
#         try:
#             community = get_object_or_404(Community, id=community_id)
#             serializer = CommunitySerializer(community, context={"request": request})
#             return Response(serializer.data)
#         except Exception as e:
#             return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CommunityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommunitySerializer
    queryset = Community.objects.all()

class UserCommunityView(APIView):
    def get(self, request):
        user= request.user
        created_communities = Community.objects.filter(creator=user)
        created_communities_serializer = CommunitySerializer(
            created_communities, many=True, context={"request": request}
        )

        joined_communities = Community.objects.filter(communitymember__user = user).exclude(creator=user)
        joined_communities_serializer = CommunitySerializer(
            joined_communities, many=True, context={"request": request}
        )

        return Response(
            {
                "created_communities": created_communities_serializer.data,
                "joined_communities": joined_communities_serializer.data,
            }
        )


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
    
    def delete(self, request, community_id):
        try:
            user_id = request.user.id
            community_member = get_object_or_404(CommunityMember, community_id=community_id, user_id=user_id)
            community_member.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CommunityDiscussionView(generics.ListCreateAPIView):
    serializer_class = DiscussionSerializer
    queryset = Discussion.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

    def get_queryset(self):
        community_id = self.kwargs.get('community_id')
        return Discussion.objects.filter(community_id=community_id)
    

class CommunityDiscussionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DiscussionSerializer
    queryset = Discussion.objects.all()

class CommunityDiscussionCommentView(generics.ListCreateAPIView):
    serializer_class = DiscussionCommentSerializer
    queryset = DiscussionComment.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

    def get_queryset(self):
        discussion_id = self.kwargs.get('discussion_id')
        return DiscussionComment.objects.filter(discussion_id=discussion_id)