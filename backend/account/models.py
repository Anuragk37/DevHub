from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class MyUserManager(BaseUserManager):
   def create_user(self,username, email, password=None,**extra_fields):
      if not email:
         raise ValueError('Users must have an email address')
      if not username:
         raise ValueError('Users must have an email address')

      user = self.model(
         email=self.normalize_email(email),
         username=username,
         **extra_fields
      )

      user.set_password(password)
      user.save(using=self._db)
      return user

   def create_superuser(self,username, email, password=None):
      user = self.create_user(
         username=username,
         email=self.normalize_email(email),
         password=password
      )
      user.is_admin = True
      user.is_staff = True
      user.is_superuser = True
      user.save(using=self._db)
      return user

class MyUser(AbstractBaseUser):
   fullname = models.CharField(max_length=50)
   username = models.CharField(max_length=50, unique=True)
   email = models.EmailField(verbose_name='email', max_length=60, unique=True)
   phone_number = models.CharField(max_length=15, unique=True)
   bio=models.TextField(blank=True)
   profile_pic=models.ImageField(upload_to='profile_pics/', blank=True, null=True)
   date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
   is_admin = models.BooleanField(default=False)
   is_active = models.BooleanField(default=True)
   is_staff = models.BooleanField(default=False)
   is_superuser = models.BooleanField(default=False)

   USERNAME_FIELD = 'username'
   REQUIRED_FIELDS = ['username','email']

   objects = MyUserManager()

   def __str__(self):
      return self.username

   def has_perm(self, perm, obj=None):
      return self.is_admin

   def has_module_perms(self, app_label):
      return True