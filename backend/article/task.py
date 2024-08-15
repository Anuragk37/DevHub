from celery import shared_task
import requests
from notification_chat.utils import send_notification
from django.conf import settings
from .models import Article


@shared_task(bind=True)
def check_toxicity(self,article_id,is_new):

    article = Article.objects.get(id=article_id)
    print(article)

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
                notify_followers(article)
        return score
    else:
        raise Exception('Error checking toxicity: ' + response.content.decode())
    

def notify_followers(article):
   followers = article.auther.following.all()

   for follower in followers:
       send_notification(follower.follower, f"A new article has been published by {article.auther.username}: {article.title}")