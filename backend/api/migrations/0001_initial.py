# Generated by Django 4.0.5 on 2022-07-04 07:53

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Move',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_square', models.CharField(max_length=10)),
                ('to_square', models.CharField(max_length=10)),
                ('uuid', models.CharField(max_length=36)),
            ],
        ),
    ]
