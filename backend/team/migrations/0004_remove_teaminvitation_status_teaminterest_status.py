# Generated by Django 5.0.6 on 2024-07-21 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('team', '0003_team_profile_pic'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='teaminvitation',
            name='status',
        ),
        migrations.AddField(
            model_name='teaminterest',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Rejected', 'Rejected')], default='Pending', max_length=20),
        ),
    ]
