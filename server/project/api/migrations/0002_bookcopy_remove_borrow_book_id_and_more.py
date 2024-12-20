# Generated by Django 4.2.16 on 2024-10-15 08:47

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BookCopy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_borrowed', models.BooleanField(default=False)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='copies', to='api.book')),
            ],
        ),
        migrations.RemoveField(
            model_name='borrow',
            name='book_id',
        ),
        migrations.RemoveField(
            model_name='borrow',
            name='borrow_date',
        ),
        migrations.RemoveField(
            model_name='borrow',
            name='borrower_name',
        ),
        migrations.RemoveField(
            model_name='borrow',
            name='return_date',
        ),
        migrations.AddField(
            model_name='borrow',
            name='borrowed_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='borrow',
            name='returned_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('borrowed_books', models.ManyToManyField(through='api.Borrow', to='api.bookcopy')),
                ('library', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.library')),
            ],
        ),
        migrations.AddField(
            model_name='borrow',
            name='book_copy',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.bookcopy'),
        ),
        migrations.AddField(
            model_name='borrow',
            name='client',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='api.client'),
            preserve_default=False,
        ),
    ]
