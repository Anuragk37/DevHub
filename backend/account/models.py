from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from admin_panel.models import Skill,Tag

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
      user.is_active =  True

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
      user.is_verified = True
      user.save(using=self._db)
      return user

class MyUser(AbstractBaseUser):
   fullname = models.CharField(max_length=50)
   username = models.CharField(max_length=50, unique=True)
   email = models.EmailField(verbose_name='email', max_length=60, unique=True)
   phone_number = models.CharField(max_length=15, unique=True)
   bio=models.TextField(blank=True)
   about=models.TextField(blank=True)
   profile_pic=models.ImageField(upload_to='profile_pics/', default='default.jpg', blank=True, null=True)
   date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
   need_review = models.BooleanField(default=False)
   is_admin = models.BooleanField(default=False)
   is_active = models.BooleanField(default=True)
   is_staff = models.BooleanField(default=False)
   is_superuser = models.BooleanField(default=False)
   is_verified = models.BooleanField(default=False)

   USERNAME_FIELD = 'username'
   REQUIRED_FIELDS = ['email']

   objects = MyUserManager()

   def __str__(self):
      return self.username

   def has_perm(self, perm, obj=None):
      return self.is_admin

   def has_module_perms(self, app_label):
      return True


class MyUserSkill(models.Model):
   user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
   skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

   def __str__(self):
      return self.user.username

class MyUserTag(models.Model):
   user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
   tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

   def __str__(self):
      return self.user.username


class Relationship(models.Model):
   follower = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="follower")
   following = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="following")
   created_at = models.DateTimeField(auto_now_add=True)

   class Meta:
      unique_together = ('follower', 'following')
   
   def __str__(self):
      return f"{self.follower.username} follows {self.following.username}"
   

class ReportUser(models.Model):
   reporter = models.ForeignKey(MyUser, on_delete=models.CASCADE,related_name="reporter")
   reported_user= models.ForeignKey(MyUser, on_delete=models.CASCADE,related_name="reported_user")
   reason = models.TextField()
   screenshot = models.ImageField(upload_to='screenshot/', blank=True, null=True)
   reported_date = models.DateTimeField(auto_now_add=True)

   def __str__(self):
      return f"{self.reporter.username} reported {self.reported_uyser.username}"