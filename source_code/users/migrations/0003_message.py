# Generated by Django 4.2.3 on 2023-10-16 12:29

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_age_user_created_at_user_height_user_is_active_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_topic', models.TextField(max_length=200)),
                ('message_text', models.TextField(max_length=2000)),
                ('message_datetime', models.DateTimeField(default=datetime.datetime(2023, 10, 16, 12, 29, 22, 842835, tzinfo=datetime.timezone.utc))),
                ('recipient_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recipient', to=settings.AUTH_USER_MODEL)),
                ('sender_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
