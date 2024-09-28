# Generated by Django 4.2.16 on 2024-09-28 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_rename_year_of_release_book_copies_available_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='genre',
            field=models.CharField(choices=[('Fiction', 'Fiction'), ('Science Fiction', 'Science Fiction'), ('Fantasy', 'Fantasy'), ('Mystery', 'Mystery'), ('Biography', 'Biography'), ('History', 'History'), ('Children', 'Children')], max_length=50),
        ),
    ]
