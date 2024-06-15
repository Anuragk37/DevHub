from django.urls import path
from . import views

urlpatterns = [
   # path('users/', views.UserListCreateView.as_view()),
   path('user/', views.UserView.as_view()),
   path('user/<int:pk>/', views.UserView.as_view()),
   path('signin/', views.UserLoginView.as_view()),
]