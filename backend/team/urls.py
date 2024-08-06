from django.urls import path
from . import views

urlpatterns = [
   path('create-team/', views.TeamView.as_view()),
   path('<int:pk>/', views.TeamRetrieveUpdateDestroyView.as_view()),
   path('team-invitation/', views.TeamInvitationView.as_view()),
   path('team-interest/', views.TeamInterestView.as_view()),
   path('team-interest/<int:team_id>/', views.TeamInterestView.as_view()),
   path('user-team/', views.UserTeamsView.as_view()),
   path('user-joined-team/', views.UserJoinedTeamsView.as_view()),
   path('team-member/<int:team_id>/', views.TeamMemberView.as_view()),
   path('member-detail/<int:pk>/', views.TeamMemberDetailView.as_view()),
   path('pending-request/<int:team_id>/', views.pending_requests),
   path('accept-request/', views.accept_request),
   path('reject-request/', views.reject_request),
   path('tasks/', views.TaskView.as_view()),
   path('tasks/<int:team_id>/', views.TaskView.as_view()),
   path('task/<int:pk>/', views.TaskDetailView.as_view()),
   path('meeting/', views.MeetingView.as_view()),
   path('meeting/<int:team_id>/', views.MeetingView.as_view()),
   path('meeting-detail/<int:pk>/', views.MeetingDetailView.as_view()),
]