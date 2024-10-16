from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.validators import MaxValueValidator
from .constants import GENRE_CHOICES, MAX_COPIES_ALLOWED


class Library(models.Model):
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = (
        ('manager', 'Manager'),
        ('librarian', 'Librarian'),
        ('worker', 'Worker'),
    )
    library = models.ForeignKey(Library, on_delete=models.CASCADE, related_name='users')
    groups = models.ManyToManyField(Group, related_name='custom_user_set')
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_set')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='worker')

    class Meta:
        permissions = [
            ("manage_library", "Can manage the library"),
            ("edit_books", "Can edit books"),
            ("view_books", "Can view books"),
        ]
    def __str__(self):
        return self.username

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    genre = models.CharField(max_length=50, choices=GENRE_CHOICES)
    copies_available = models.PositiveIntegerField(
        validators=[MaxValueValidator(MAX_COPIES_ALLOWED)]
    )
    library = models.ForeignKey(Library, on_delete=models.CASCADE, related_name='books')

    def __str__(self):
        return self.title

class BookCopy(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='copies')
    is_borrowed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.book.title} - Copy {self.id}"

class Client(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    library = models.ForeignKey(Library, on_delete=models.CASCADE)
    borrowed_books = models.ManyToManyField(BookCopy, through='Borrow')

    def __str__(self):
        return self.name

class Borrow(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    book_copy = models.ForeignKey(BookCopy, on_delete=models.CASCADE)
    borrowed_at = models.DateTimeField(auto_now_add=True)
    returned_at = models.DateTimeField(null=True, blank=True)