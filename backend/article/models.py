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
   likes=models.ManyToManyField(MyUser,related_name='likes',blank=True)
   comment_count=models.IntegerField(default=0)
   needs_review = models.BooleanField(default=False)
   
   def __str__(self) -> str:
      return self.title

class ArticleTag(models.Model):
   article = models.ForeignKey(Article,on_delete=models.CASCADE)
   tag = models.ForeignKey(Tag,on_delete=models.CASCADE)

   def __str__(self) -> str:
      return self.article.title


class SavedArticle(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'article')

    def __str__(self):
        return f"{self.user.username} saved {self.article.title}"
    
class ReportedArticle(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    reason = models.TextField()
    reported_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} reported {self.article.title}"

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


   
