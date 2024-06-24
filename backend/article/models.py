from django.db import models
from account.models import MyUser
from admin_panel.models import Tag
from django.db.models.signals import post_save
from django.dispatch import receiver
# from django_quill.fields import QuillField

# Create your models here.

class Article(models.Model):
   title = models.CharField(max_length=250)
   content=models.TextField()
   thumbnail = models.ImageField(upload_to='article_thumbnail/')
   create_at=models.DateTimeField(auto_now_add=True)
   auther = models.ForeignKey(MyUser,on_delete=models.CASCADE)
   like_count=models.IntegerField(default=0)
   comment_count=models.IntegerField(default=0)
   
   def __str__(self) -> str:
      return self.title

class ArticleTag(models.Model):
   article = models.ForeignKey(Article,on_delete=models.CASCADE)
   tag = models.ForeignKey(Tag,on_delete=models.CASCADE)

   def __str__(self) -> str:
      return self.article.title


class Comment(models.Model):
   article = models.ForeignKey(Article,on_delete=models.CASCADE,related_name='comments')
   user = models.ForeignKey(MyUser,on_delete=models.CASCADE)
   comment = models.TextField()
   parent = models.ForeignKey('self',on_delete=models.CASCADE,related_name='replies',blank=True,null=True)
   created_at = models.DateTimeField(auto_now_add=True)

   def __str__(self) -> str:
      return self.comment
   @property
   def children(self):
      return self.replies.all()

@receiver(post_save, sender=Comment)
def update_comment_count(sender, instance, created, **kwargs):
   if created:
      instance.article.comment_count += 1
      instance.article.save()
   
