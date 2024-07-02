from django.db import models
from django.core.exceptions import ValidationError

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
