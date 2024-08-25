from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

# Create your models here.
class Skill(models.Model):
   name=models.CharField(max_length=50,unique=True)

   def clean(self):
        if Skill.objects.filter(name__iexact=self.name).exclude(id=self.id).exists():
            raise ValidationError({'name': 'A skill with this name already exists.'})

   def save(self, *args, **kwargs):
      self.full_clean()  
      super().save(*args, **kwargs)

   def __str__(self):
      return self.name
   
class Tag(models.Model):
   name=models.CharField(max_length=50,unique=True)

   def clean(self):
        if Tag.objects.filter(name__iexact=self.name).exclude(id=self.id).exists():
            raise ValidationError({'name': 'A tag with this name already exists.'})

   def save(self, *args, **kwargs):
      self.full_clean()  
      super().save(*args, **kwargs)

   def __str__(self):
      return self.name


class Feedback(models.Model):
   user=models.ForeignKey('account.MyUser',on_delete=models.CASCADE)
   feedback=models.TextField()
   improvement=models.TextField()
   image=models.ImageField(null=True,blank=True,upload_to='feedback_images')
   rating=models.IntegerField()
   date = models.DateTimeField(auto_now_add=True)


   def __str__(self):
      return f"{self.user} - {self.rating}"
