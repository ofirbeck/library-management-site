# Generated by Django 4.2.16 on 2024-10-21 10:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_book_copies_available_alter_borrow_book_copy'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'user', 'verbose_name_plural': 'users'},
        ),
    ]
