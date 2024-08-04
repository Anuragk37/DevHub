from django.urls import path
from . import views

urlpatterns = [
   # path('users/', views.UserListCreateView.as_view()),
   path('user/', views.UserView.as_view()),
   path('user/<int:pk>/', views.UserView.as_view()),
   path('signin/', views.UserLoginView.as_view()),
   path('resend-otp/', views.resend_otp),
   path('verify-otp/', views.verify_otp),
   path('reset-password/', views.reset_password),
   path('user-skill/', views.UserSkillView.as_view()),
   path('user-skill/<int:user_id>/', views.UserSkillView.as_view()),
   path('user-tag/', views.UserTagView.as_view()),
   path('user-tag/<int:user_id>/', views.UserTagView.as_view()),
   path('follow-unfollow/', views.RelationshipView.as_view(), name='follow_unfollow'),
   path('followers/<int:user_id>/', views.UserFollowersView.as_view()),
   path('following/<int:user_id>/', views.UserFollowingView.as_view()),
   path('report-user/', views.UserReportView.as_view()),
   path('report-user/<int:user_id>/', views.UserReportView.as_view()),
   path('reported-users/', views.ReportedUsersView.as_view()),
]