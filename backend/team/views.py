from rest_framework import generics,status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404 
from .models import *
from .serializers import *
from account.models import*
from rest_framework.decorators import api_view
from notification_chat.utils import send_notification

# Create your views here.


class TeamView(generics.ListCreateAPIView):
    serializer_class = TeamSerializer

    def get_queryset(self):
        return Team.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        skills = self.request.data.getlist('skills_required')
        team = serializer.save(creator=user)

        TeamMember.objects.create(team=team, user=self.request.user)

        for skill_id in skills:
            skill = get_object_or_404(Skill, id=skill_id)
            TeamSkill.objects.create(team=team, skill=skill)

        users_with_skills = MyUserSkill.objects.filter(skill__in=skills).values_list('user', flat=True)

        for user_id in users_with_skills:
            user_with_skill = get_object_or_404(MyUser, id=user_id)
            if user != user_with_skill:
                TeamInvitation.objects.get_or_create(team=team, user=user_with_skill)


class TeamRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()


class UserTeamsView(generics.ListAPIView):
    serializer_class = TeamSerializer

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(creator=user)

class UserJoinedTeamsView(generics.ListAPIView):
    serializer_class = TeamSerializer

    def get_queryset(self):
        user = self.request.user
        team_ids = TeamMember.objects.filter(user=user).values_list('team_id', flat=True)
        return Team.objects.filter(id__in=team_ids) 

class TeamInvitationView(generics.ListCreateAPIView):
    serializer_class = TeamInvitationSerializer
    queryset = TeamInvitation.objects.all()

    def get_queryset(self):
        user = self.request.user
        return TeamInvitation.objects.filter(user=user)


class TeamInterestView(APIView):
    def post(self, request):
        try:
            
            team_id = request.data.get('team_id')
            team = get_object_or_404(Team, id=team_id)
            user = request.user
            serializer = TeamInterestSerializer(data={'team': team.id, 'user': user.id})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
   
    def get(self, request,team_id):
        if team_id:
            team = get_object_or_404(Team, id=team_id)
            user = request.user
            interest = TeamInterest.objects.filter(team=team, user=user).exists()
            if interest:
               serializer = TeamInterestSerializer(TeamInterest.objects.filter(team=team, user=user), many=True)
               print(serializer.data)
               return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            user = request.user
            serializer = TeamInterestSerializer(TeamInterest.objects.filter(user=user), many=True)
            return Response(serializer.data)
        


class TeamMemberView(generics.ListAPIView):
    serializer_class = TeamMemberSerializer

    def get_queryset(self):
        team_id = self.kwargs.get('team_id')
        team_members = TeamMember.objects.filter(team_id=team_id)
        return team_members

class TeamMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer

@api_view(['GET'])  
def pending_requests(request, team_id):
    team = get_object_or_404(Team, id=team_id)
    pendings = TeamInterest.objects.filter(team=team, status='Pending')
    Res = TeamInterestSerializer(pendings, many=True, context={'request': request})
    return Response(Res.data)


@api_view(['POST'])
def accept_request(request):
    try:
        team_id = request.data.get('team_id')
        user_id = request.data.get('user_id')
        team = get_object_or_404(Team, id=team_id)
        user = get_object_or_404(MyUser, id=user_id)
        TeamInterest.objects.filter(team=team, user=user).update(status='Accepted')

        TeamMember.objects.create(team=team, user=user)

        message = f"Your request to join the team {team.name} has been accepted."
        send_notification(user, message)

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reject_request(request):
    try:
        team_id = request.data.get('team_id')
        user_id = request.data.get('user_id')
        team = get_object_or_404(Team, id=team_id)
        user = get_object_or_404(MyUser, id=user_id)
        TeamInterest.objects.filter(team=team, user=user).update(status='Rejected')

        message = f"Your request to join the team {team.name} has been rejected."
        send_notification(user, message)

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

class TaskView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        team_id = self.kwargs.get('team_id')
        team = get_object_or_404(Team, id=team_id)
        return Task.objects.filter(team=team)

    def perform_create(self, serializer):
        user_id = self.request.data.get('assigned_to')
        user = get_object_or_404(MyUser, id=user_id)
        team_id = self.request.data.get('team')
        team = get_object_or_404(Team, id=team_id)

        if not team.members.filter(user=user).exists():
            return Response({'detail': 'User is not a member of this team.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(team=team, assigned_to=user)

        send_notification(user, f"You have a new task in {team.name}.")

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class MeetingView(generics.ListCreateAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

    def get_queryset(self):
        team_id = self.kwargs.get('team_id')
        team = get_object_or_404(Team, id=team_id)
        return Meeting.objects.filter(team=team)

class MeetingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    

