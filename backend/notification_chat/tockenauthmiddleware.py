# notification_chat/jwtauthmiddleware.py

from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token):
    try:
        access_token = AccessToken(token)
        user = User.objects.get(id=access_token['user_id'])
        return user
    except (InvalidToken, TokenError, User.DoesNotExist):
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        query_params = dict(qp.split('=') for qp in query_string.split('&') if '=' in qp)
        token = query_params.get('token')
        scope['user'] = await get_user_from_token(token) if token else AnonymousUser()
        
        return await self.inner(scope, receive, send)

JWTAuthMiddlewareStack = lambda inner: JWTAuthMiddleware(AuthMiddlewareStack(inner))