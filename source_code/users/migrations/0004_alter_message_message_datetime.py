# Generated by Django 4.2.3 on 2023-10-16 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_message'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='message_datetime',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]