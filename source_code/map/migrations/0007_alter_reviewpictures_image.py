# Generated by Django 4.2.3 on 2023-10-21 22:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0006_alter_review_author'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reviewpictures',
            name='image',
            field=models.ImageField(blank=True, upload_to='review_pictures/'),
        ),
    ]
