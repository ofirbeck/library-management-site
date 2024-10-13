from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from .constants import GENRE_CHOICES

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
    copies_available = models.IntegerField()
    library = models.ForeignKey(Library, on_delete=models.CASCADE, related_name='books')

    def __str__(self):
        return self.title

class Borrow(models.Model):
    book_id = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrower_name = models.CharField(max_length=100)
    borrow_date = models.DateField(auto_now_add=True)
    return_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.borrower_name} borrowed {self.book.title}"