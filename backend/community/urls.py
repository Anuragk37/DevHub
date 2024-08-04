from django.urls import path
from . import views

urlpatterns = [

   path('', views.CommunityView.as_view()),
   path('<int:pk>/', views.CommunityDetailView.as_view()),
   path('join-community/', views.CommunityMemberView.as_view()),
   path('community-members/<int:community_id>/', views.CommunityMemberView.as_view()),
   path('user-community/', views.UserCommunityView.as_view()),
   path('discussion/', views.CommunityDiscussionView.as_view()),
   path('discussion/<int:community_id>/', views.CommunityDiscussionView.as_view()),
   path('discussion-comment/', views.CommunityDiscussionCommentView.as_view()),
   path('discussion-comment/<int:discussion_id>/', views.CommunityDiscussionCommentView.as_view()),
]
