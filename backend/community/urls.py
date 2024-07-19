from django.urls import path
from . import views

urlpatterns = [

   path('', views.CommunityView.as_view()),
   path('<int:pk>/', views.CommunityView.as_view()),
   
]
