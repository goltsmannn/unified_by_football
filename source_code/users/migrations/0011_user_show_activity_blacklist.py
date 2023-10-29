# Generated by Django 4.2.3 on 2023-10-29 16:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_user_last_proposed'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='show_activity',
            field=models.BooleanField(default=True),
        ),
        migrations.CreateModel(
            name='BlackList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_from', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_from_blacklist', to=settings.AUTH_USER_MODEL)),
                ('user_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_to_blacklist', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user_from', 'user_to')},
            },
        ),
    ]
