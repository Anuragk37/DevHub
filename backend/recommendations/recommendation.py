import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.db.models import Prefetch
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import MultiLabelBinarizer

from article.models import *
from account.models import *


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



#user recommendation

def load_user_data():
    users = MyUser.objects.prefetch_related(
        Prefetch('myuserskill_set', queryset=MyUserSkill.objects.select_related('skill')),
        Prefetch('myusertag_set', queryset=MyUserTag.objects.select_related('tag'))
    ).exclude(is_superuser=True)

    user_data = []
    for user in users:
        skills = [user_skill.skill.name for user_skill in user.myuserskill_set.all()]
        tags = [user_tag.tag.name for user_tag in user.myusertag_set.all()]

        user_data.append({
            'id': user.id,
            'skills': skills,
            'tags': tags
        })

    return pd.DataFrame(user_data)

def feature_engineering(user_profiles):
    mlb_skills = MultiLabelBinarizer()
    mlb_tags = MultiLabelBinarizer()

    user_profiles = user_profiles.join(pd.DataFrame(mlb_skills.fit_transform(user_profiles.pop('skills')), columns=[f"skill_{skill}" for skill in mlb_skills.classes_], index=user_profiles.index))
    user_profiles = user_profiles.join(pd.DataFrame(mlb_tags.fit_transform(user_profiles.pop('tags')), columns=[f"tag_{tag}" for tag in mlb_tags.classes_], index=user_profiles.index))

    print(user_profiles)

    return user_profiles

def train_model(interaction_matrix):
    svd = TruncatedSVD(n_components=10)
    user_factors = svd.fit_transform(interaction_matrix)
    user_similarity = cosine_similarity(user_factors)

    return user_similarity

def get_existing_relationships(user_id):
    existing_relationships = Relationship.objects.filter(follower_id=user_id).values_list('following_id', flat=True)
    return set(existing_relationships)

def get_user_recommendations(user_id, user_similarity, user_profiles, existing_relationships, top_n=5):
    user_idx = user_profiles.index[user_profiles['id'] == user_id].tolist()[0]
    similarity_scores = list(enumerate(user_similarity[user_idx]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    similar_user_indices = [score[0] for score in similarity_scores[1:top_n+1]]

    similar_users = user_profiles.iloc[similar_user_indices]['id'].tolist()

    recommended_users = [user for user in similar_users if user not in existing_relationships]

    return recommended_users

def recommend_users(user_id, top_n=5):
    user_profiles = load_user_data()
    interaction_matrix = feature_engineering(user_profiles)
    user_similarity = train_model(interaction_matrix)
    
    existing_relationships = get_existing_relationships(user_id)
    recommendations = get_user_recommendations(user_id, user_similarity, user_profiles, existing_relationships, top_n)

    return recommendations

