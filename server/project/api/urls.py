from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    path('libraries/create/', create_new_library_and_its_admin, name='create_new_library_and_its_admin'),
    path('login/', login, name='login'),
    path('genres/', get_genre_list, name='get_genre_list'),
    path('books/', get_book_list, name='get_book_list'),
    path('books/create/', create_new_book, name='create_new_book'),
    path('books/<int:pk>/', update_book, name='update_book'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]