import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


from article.models import *


def get_dataframes():
   articles = Article.objects.all().values('id', 'title', 'content')
   articles_df = pd.DataFrame(articles)

   viewed_article = ViewedArticle.objects.all().values('user_id','article_id')
   viewed_article_df = pd.DataFrame(viewed_article)

   liked_article = Article.objects.filter(likes__isnull=False).values('id', 'likes__id')
   liked_article_df = pd.DataFrame(liked_article)

   return articles_df, viewed_article_df, liked_article_df


def preprocess_text(text):
   stop_words = set(stopwords.words('english'))
   lemmatizer = WordNetLemmatizer()

   tokens = word_tokenize(text)
   filtered_tokens = [token for token in tokens if token.lower() not in stop_words]
   lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]

   return ' '.join(lemmatized_tokens)


def recommend_articles(user_id):
   articles_df, viewed_article_df, liked_article_df = get_dataframes()

   articles_df['combined_text'] = articles_df['title'] + " " + articles_df['content']

   articles_df['processed_content'] = articles_df['combined_text'].apply(preprocess_text)

   vectorizer = TfidfVectorizer(max_features=1000)
   X = vectorizer.fit_transform(articles_df['processed_content'])

   cosine_sim = cosine_similarity(X,X)

   def get_user_interactions(user_id):
      liked = liked_article_df[liked_article_df['likes__id'] == user_id]['id'].tolist()
      viewed = viewed_article_df[viewed_article_df['user_id'] == user_id]['article_id'].tolist()
      return liked + viewed
   
   def generate_recommendations(user_id):
      user_artticles = get_user_interactions(user_id)
      sim_scores = []

      for article_id in user_artticles:
         idx = articles_df[articles_df['id'] == article_id].index[0]
         sim_scores.extend(list(enumerate(cosine_sim[idx])))

      sim_scores =sorted(list(set(sim_scores)),key=lambda x:x[1],reverse=True)
      sim_scores = [s for s in sim_scores if s[0] not in user_artticles][:10]

      recommend_articles_ids = [articles_df.iloc[s[0]]['id'] for s in sim_scores]

      recommended_articles = Article.objects.filter(id__in=recommend_articles_ids)
      return recommended_articles
   
   return generate_recommendations(user_id)