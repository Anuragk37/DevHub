from django.urls import path
from . import views

urlpatterns = [
   path('admin-login/',views.AdminLoginView.as_view()),
   path('skills/',views.SkillView.as_view()),
   path('tags/',views.TagView.as_view()),
]