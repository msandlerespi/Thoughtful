# Generated by Django 3.0.8 on 2020-09-07 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('writer', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]