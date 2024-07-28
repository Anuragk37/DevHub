from django.urls import path
from . import views

urlpatterns = [

   path('', views.CommunityView.as_view()),
   path('<int:community_id>/', views.CommunityDetailView.as_view()),
   path('join-community/', views.CommunityMemberView.as_view()),
   path('community-members/<int:community_id>/', views.CommunityMemberView.as_view()),
]
