# Generated by Django 5.0.6 on 2024-07-20 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('team', '0002_alter_teaminvitation_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='team',
            name='profile_pic',
            field=models.ImageField(blank=True, null=True, upload_to='team_profile_pic/'),
        ),
    ]
