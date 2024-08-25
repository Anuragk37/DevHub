from django.urls import path
from . import views

urlpatterns = [
   path('admin-login/',views.AdminLoginView.as_view()),
   path('',views.AdminDashboardView.as_view()),
   path('skills/',views.SkillView.as_view()),
   path('skills/<int:pk>/',views.SkillRetrieveUpdateDestroyView.as_view()),
   path('tags/',views.TagView.as_view()),
   path('tags/<int:pk>/',views.TagRetrieveUpdateDestroyView.as_view()),
   path('block-user/<int:pk>/',views.blockUser),
   path('unblock-user/<int:pk>/',views.unblockUser),
   path('feedback/',views.FeedbackView.as_view()),
   path('feedback/<int:pk>/',views.FeedbackRetrieveUpdateDestroyView.as_view()),
]