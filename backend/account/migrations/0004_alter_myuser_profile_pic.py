# Generated by Django 5.0.6 on 2024-06-17 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_myuser_is_verified'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='profile_pic',
            field=models.ImageField(blank=True, default='profile_pics/default.jpg', null=True, upload_to='profile_pics/'),
        ),
    ]
