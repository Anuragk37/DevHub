from django.urls import path
from . import views

urlpatterns = [

   path('',views.ArticleView.as_view()),
   path('<int:pk>/',views.ArticleDetailView.as_view()),
   path('comment/',views.CommentView.as_view()),
   path('comment/<int:article_id>',views.CommentView.as_view()),
   path('user-article/<int:user_id>/',views.UserArticleView.as_view()),
   path('like-article/<int:article_id>/',views.likeArticle),
   path('related-article/<int:article_id>/',views.RelatedArticleView.as_view()),
   path('save-article/<int:article_id>/', views.SaveArticleView.as_view()),
   path('saved-articles/', views.SavedArticleListView.as_view()),
   path('report-article/', views.ReportArticleView.as_view()),
   path('report-article/<int:article_id>/', views.ReportArticleView.as_view()),
   path('reported-articles/', views.ReportedArticleListView.as_view()),
   path('search/', views.SearchView.as_view()),
   
]