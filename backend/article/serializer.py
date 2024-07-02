from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer
from admin_panel.serializers import TagSerializer

class ArticleSerializer(serializers.ModelSerializer):
    auther = UserSerializer(read_only=True)
    auther_id = serializers.PrimaryKeyRelatedField(source='auther', queryset=MyUser.objects.all(), write_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    tags = serializers.ListField(
        child=serializers.JSONField(), write_only=True
    )
    like_count = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'thumbnail', 'auther', 'auther_id', 'create_at', 'like_count', 'liked','is_saved', 'comment_count', 'tags', 'thumbnail_url']

    def create(self, validated_data):
        auther_id = validated_data.pop('auther')
        auther = MyUser.objects.get(id=auther_id.id)
        tags_data = validated_data.pop('tags')
        article = Article.objects.create(auther=auther, **validated_data)
        for tag_data in tags_data:
            tag = Tag.objects.get(id=tag_data['id'])
            ArticleTag.objects.create(article=article, tag=tag)
        return article

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)
        instance = super().update(instance, validated_data)
        
        if tags_data is not None:
            instance.articletag_set.all().delete()
            for tag_data in tags_data:
                tag_id = tag_data.get('id')
                if tag_id:
                    tag = Tag.objects.get(id=tag_id)
                    ArticleTag.objects.create(article=instance, tag=tag)

        return instance

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None
   
    def get_like_count(self, obj):
        return obj.likes.count()

    def get_liked(self, obj):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return SavedArticle.objects.filter(user=request.user, article=obj).exists()
        return False

    def to_representation(self, instance):
        data = super().to_representation(instance)
        tags = ArticleTag.objects.filter(article=instance).values_list('tag__id', 'tag__name')
        data['tags'] = [{'id': tag[0], 'name': tag[1]} for tag in tags]
        return data


   
   
class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

class CommentSerilaizer(serializers.ModelSerializer):
   user = serializers.PrimaryKeyRelatedField(queryset=MyUser.objects.all())
   replies = RecursiveField(many=True, read_only=True)
   class Meta:
      model = Comment
      fields = '__all__'

   def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = UserSerializer(instance.user).data
        return rep
   

class SavedArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedArticle
        fields = ['id', 'user', 'article', 'saved_at']
        read_only_fields = ['user', 'saved_at']

class ReportArticleSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ReportedArticle
        fields = ['id', 'user', 'article', 'reason', 'reported_at']



      