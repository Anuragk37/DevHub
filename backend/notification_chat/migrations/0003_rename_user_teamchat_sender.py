# Generated by Django 5.0.6 on 2024-07-28 10:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notification_chat', '0002_teamchat'),
    ]

    operations = [
        migrations.RenameField(
            model_name='teamchat',
            old_name='user',
            new_name='sender',
        ),
    ]
