from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer

class ArticleSerializer(serializers.ModelSerializer):
   auther  = UserSerializer
   class Meta:
      model = Article
      fields = '__all__'

   def create(self, validated_data):
      auther_data = validated_data.pop('auther')
      auther_id = auther_data.id
      auther = MyUser.objects.get(id=auther_id)
      article = Article.objects.create(auther=auther, **validated_data)
      return article

class CommentSerilaizer(serializers.ModelSerializer):
   user = serializers.PrimaryKeyRelatedField(queryset=MyUser.objects.all())
   class Meta:
      model = Comment
      fields = '__all__'

   def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = UserSerializer(instance.user).data
        return rep

      