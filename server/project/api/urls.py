from django.urls import path
from .views import get_genre_list, get_book_list, create_new_book, update_book

urlpatterns = [
    path('genres/', get_genre_list, name='get_genre_list'),
    path('books/', get_book_list, name='get_book_list'),
    path('books/create/', create_new_book, name='create_new_book'),
    path('books/<int:pk>/', update_book, name='update_book'),
]