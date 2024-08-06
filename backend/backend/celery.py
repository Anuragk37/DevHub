from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')



# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.

app.conf.enable_utc = False
app.conf.update(timezone='Asia/Kolkata')

app.config_from_object(settings, namespace='CELERY')


app.conf.beat_schedule = {
   'send-meeting-reminder': {
      'task': 'team.tasks.send_meeting_reminder',
      'schedule': crontab(minute='*'),
   },
   'send-task-reminder': {
      'task': 'team.tasks.send_task_reminder',
      'schedule': crontab(hour=10 ,minute=0),
   }
}

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')