from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    path('libraries/create/', create_new_library_and_its_admin, name='create_new_library_and_its_admin'),
    path('login/', login, name='login'),
    path('user/', get_user_info, name='get_user_info'),
    path('users/', get_users_in_library, name='get_users_in_library'),
    path('users/create/', create_user, name='create_user'),
    path('users/<int:user_id>/', delete_user, name='delete_user'),
    path('roles/', get_roles_list, name='get_roles_list'),
    path('genres/', get_genre_list, name='get_genre_list'),
    path('books/', get_book_list, name='get_book_list'),
    path('books/create/', create_new_book, name='create_new_book'),
    path('books/<int:pk>/', update_book, name='update_book'),
    path('books/<int:book_id>/copies/', get_copies, name='get_copies'),
    path('books/copies/borrow/', borrow_copy, name='borrow_copy'),
    path('books/copies/return/', return_copy, name='return_copy'),
    path('clients/', get_clients, name='get_clients'),
    path('clients/create/', create_new_client, name='create_new_client'),
    path('clients/<int:client_id>/', delete_client, name='delete_client'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]