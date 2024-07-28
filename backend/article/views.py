from django.shortcuts import get_object_or_404, render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
import json
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.db.models import Count
from rest_framework.pagination import PageNumberPagination





from .models import *
from .serializer import *

# Create your views here.


class ArticlePagination(PageNumberPagination):
    page_size =10
    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

class ArticleView(generics.ListCreateAPIView):
   queryset=Article.objects.all()
   serializer_class= ArticleSerializer

   pagination_class = ArticlePagination

   def post(self, request):
      title=request.data['title']
      content=request.data['content']
      thumbnail=request.data['thumbnail']
      auther_id=request.data['user']
      tags=request.data['tags']

      if isinstance(tags, str):
            try:
                tags = json.loads(tags)
            except json.JSONDecodeError:
                return Response({"tags": ["Invalid tags format. Expected a list of objects."]}, status=status.HTTP_400_BAD_REQUEST)

      serializer = ArticleSerializer(data={'title':title,'content':content,'thumbnail':thumbnail,'auther_id':auther_id,'tags':tags}, context={'request': request})
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data)
      print(serializer.errors)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
   def get(self, request):
        if request.user.is_authenticated:
            articles = Article.objects.exclude(auther=request.user)
        else:
            articles = Article.objects.all()
        page = self.paginate_queryset(articles)
        if page is not None:
            serializer = self.get_paginated_response(ArticleSerializer(page, many=True, context={'request': request}).data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        serializer = ArticleSerializer(articles, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
   
   def get_serializer_context(self):
        return {'request': self.request}
   
   

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def delete(self, request, *args, **kwargs):
        article = self.get_object()
        if request.user == article.auther or request.user.is_superuser:
            return super().delete(request, *args, **kwargs)
        else:
            raise PermissionDenied("You do not have permission to delete this article.")

    def patch(self, request, *args, **kwargs):
        article = self.get_object()
        if request.user != article.auther:
            raise PermissionDenied("You do not have permission to edit this article.")

        tags = request.data.get('tags')
        if isinstance(tags, str):
            try:
                tags = json.loads(tags)
            except json.JSONDecodeError:
                return Response({"tags": ["Invalid tags format. Expected a list of objects."]}, status=status.HTTP_400_BAD_REQUEST)

        request.data['tags'] = tags

        serializer = self.get_serializer(article, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get_serializer_context(self):
        return {'request': self.request}


class CommentView(APIView):
      def post(self, request):
        user_id = request.data.get('user_id')
        article_id = request.data.get('article_id')
        comment = request.data.get('commentBody')
        parent_id = request.data.get('parent_id')

        data = {
            'user': user_id,
            'article': article_id,
            'comment': comment,
            'parent': parent_id
        }
        serializer = CommentSerilaizer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
      def get(self,request,article_id):
          comments = Comment.objects.filter(article_id=article_id,parent_id=None).order_by('-created_at')
          serializer = CommentSerilaizer(comments,many=True)
          return Response(serializer.data ,status=status.HTTP_200_OK)

@api_view(['POST'])
def likeArticle(request, article_id):
    article = get_object_or_404(Article, pk=article_id)
    user = request.user
    if user in article.likes.all():
        article.likes.remove(user)
    else:
        article.likes.add(user)
    article.save()
    serializer = ArticleSerializer(article, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)



class UserArticleView(APIView):
    def get(self, request, user_id):
        print("user_id",user_id)
        articles = Article.objects.filter(auther=user_id)
        print("articles",articles)
        serializer = ArticleSerializer(articles, many=True,context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class SaveArticleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_id):
        article = get_object_or_404(Article, id=article_id)
        saved_article, created = SavedArticle.objects.get_or_create(user=request.user, article=article)
        if created:
            return Response({'message': 'Article saved successfully'}, status=status.HTTP_201_CREATED)
        else:
            saved_article.delete()
            return Response({'message': 'Article already saved'}, status=status.HTTP_200_OK)
            

class SavedArticleListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        saved_articles = SavedArticle.objects.filter(user=request.user)
        article_ids = saved_articles.values_list('article_id', flat=True)
        articles = Article.objects.filter(id__in=article_ids)
        serializer = ArticleSerializer(articles, many=True,context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class RelatedArticleView(APIView):
    def get(self, request, article_id):
        try:
            article = get_object_or_404(Article, pk=article_id)
            tag_ids = ArticleTag.objects.filter(article=article).values_list('tag_id', flat=True)
            articles = Article.objects.filter(articletag__tag_id__in=tag_ids).exclude(id=article_id).distinct()[:5]
            serializer = ArticleSerializer(articles, many=True,context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class ReportArticleView(APIView):
    def post(self, request):
        article_id = request.data.get('article_id')
        article = get_object_or_404(Article, pk=article_id)
        user = request.user
        reason = request.data.get('reason')

        data = {
            'user': user.id,  
            'article': article.id,
            'reason': reason
        }

        serializer = ReportArticleSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=user)  
            report_count = ReportedArticle.objects.filter(article=article).count()
            if report_count >= 1:
                article.needs_review = True
                article.save()
            return Response({'message': 'Article reported successfully'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request ,article_id):
        article = get_object_or_404(Article, pk=article_id)
        reported_articles = ReportedArticle.objects.filter(article=article)
        serializer = ReportArticleSerializer(reported_articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ReportedArticleListView(APIView):
    def get(self, request):
        reported_articles = ReportedArticle.objects.all()
        article_ids = reported_articles.values_list('article_id', flat=True)
        articles = Article.objects.filter(id__in=article_ids).annotate(total_reports_count=Count('reportedarticle'))
        
        serializer = ArticleSerializer(articles, many=True, context={'request': request})
        
        for idx, article_data in enumerate(serializer.data):
            article_data['total_reports'] = articles[idx].total_reports_count
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class SearchView(APIView):
    def get(self, request):
        keyword = request.GET.get('keyword')
        articles = Article.objects.filter(Q(title__icontains=keyword) | Q(content__icontains=keyword))
        article_serializer = ArticleSerializer(articles, many=True,context={'request': request})
        users = MyUser.objects.filter(username__icontains=keyword)
        user_serializer = UserSerializer(users, many=True,context={'request': request}) 

        response_data = {
            'articles': article_serializer.data,
            'users': user_serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)



   
