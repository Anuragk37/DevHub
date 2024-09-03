from celery import shared_task
import requests
from notification_chat.utils import send_notification
from django.conf import settings
from account.models import Relationship
from article.models import Article
from django.core.cache import cache
import requests

@shared_task(bind=True)
def check_toxicity(self,article_id, serialized_article_data, is_new):
    from article.serializer import ArticleSerializer
    
    # Get the article using the article_id
    article = Article.objects.get(id=article_id)
    
    url = f'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key={settings.PERSPECTIVE_API_KEY}'
    data = {
        'comment': {'text': article.content},
        'languages': ['en'],
        'requestedAttributes': {'TOXICITY': {}}
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        result = response.json()
        score = result['attributeScores']['TOXICITY']['summaryScore']['value']
        if score > 0.7:
            article.flaged = True
            article.save()
            send_notification(article.auther, f"Your article {article.title} has been flagged as toxic.")
        else:
            article.flaged = False
            article.save()
            if is_new:
                author = article.auther
                relationships = Relationship.objects.filter(following=author)
                for relationship in relationships:
                    user = relationship.follower
                    page = 1
                    cache_key = f'articles_page_{page}_user_{user.id}'
                    cached_data = cache.get(cache_key)
                    if cached_data is not None:
                        articles_data = cached_data['results']
                        # Use the serialized data directly
                        articles_data.insert(0, serialized_article_data)
                        cached_data['results'] = articles_data
                        cache.set(cache_key, cached_data, 3600)
                notify_followers(article)
        return score
    else:
        raise Exception('Error checking toxicity: ' + response.content.decode())

    

def notify_followers(article):
   followers = article.auther.following.all()

   for follower in followers:
       send_notification(follower.follower, f"A new article has been published by {article.auther.username}: {article.title}")