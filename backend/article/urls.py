from django.urls import path
from . import views

urlpatterns = [

   path('',views.ArticleView.as_view()),
   path('<int:pk>/',views.ArticleDetailView.as_view()),
   
]