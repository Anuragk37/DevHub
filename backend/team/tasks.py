
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Meeting, Task
from notification_chat.utils import send_notification
import logging
from pytz import timezone as pytz_timezone
from django.core.cache import cache
from account.utils import send_email

logger = logging.getLogger(__name__)

@shared_task()
def send_meeting_reminder():
    try:
        kolkata_timezone = pytz_timezone('Asia/Kolkata')
        now = timezone.now().astimezone(kolkata_timezone)
        start_time = now + timedelta(minutes=10)

        meetings = Meeting.objects.filter(date=now.date(), time__range=(now.time(), start_time.time()))

        for meeting in meetings:
            cache_key = f"meeting_{meeting.id}"
            if not cache.get(cache_key):
                team_members = meeting.team.members.all()

                for member in team_members:
                    send_email(email=member.user.email,subject="Meeting Reminder",message=f"Meeting Reminder: {meeting.title}")
                    send_notification(member.user, f"Meeting Reminder: {meeting.title}")    
                    

                cache.set(cache_key, True, timeout=600)

    except Exception as e:
        logger.error(f"Error occurred: {e}")


@shared_task()
def send_task_reminder():
    tomorrow = timezone.now() + timedelta(days=1)
    start_of_tomorrow = tomorrow.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_tomorrow = tomorrow.replace(hour=23, minute=59, second=59, microsecond=999999)

    tasks = Task.objects.filter(deadline__range=(start_of_tomorrow, end_of_tomorrow))

    for task in tasks:
        send_notification(task.assigned_to, f"Task Reminder: {task.task}")
        send_email(email=task.assigned_to.email,subject="Task Reminder",message=f"Task Reminder: {task.task}")
