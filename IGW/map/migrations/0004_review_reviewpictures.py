# Generated by Django 4.2.3 on 2023-08-04 13:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0003_alter_placemark_x_alter_placemark_y'),
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.CharField(max_length=10)),
                ('text', models.CharField(max_length=200)),
                ('rating', models.PositiveSmallIntegerField()),
                ('placemark', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='map.placemark')),
            ],
        ),
        migrations.CreateModel(
            name='ReviewPictures',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='')),
                ('review', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='map.review')),
            ],
        ),
    ]
