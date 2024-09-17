from django.urls import path
from .views import get_book_list, create_new_book

urlpatterns = [
    path('books/', get_book_list, name='get_book_list'),
    path('books/create/', create_new_book, name='create_new_book')
]