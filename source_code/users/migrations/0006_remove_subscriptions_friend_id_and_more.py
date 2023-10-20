# Generated by Django 4.2.3 on 2023-10-19 17:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_rename_recipient_id_message_recipient_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscriptions',
            name='friend_id',
        ),
        migrations.RemoveField(
            model_name='subscriptions',
            name='user_id',
        ),
        migrations.AddField(
            model_name='subscriptions',
            name='user_from',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='user_from', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='subscriptions',
            name='user_to',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='user_to', to=settings.AUTH_USER_MODEL),
        ),
    ]
