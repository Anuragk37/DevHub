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
   path('delete-member/<int:team_id>/<int:user_id>/', views.TeamMemberDeleteView.as_view()),
   path('pending-request/<int:team_id>/', views.pending_requests),
   path('accept-request/', views.accept_request),
   path('reject-request/', views.reject_request),
]