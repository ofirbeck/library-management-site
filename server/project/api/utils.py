from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from .models import User, Library

def assign_permissions(user):
    content_type = ContentType.objects.get_for_model(Library)
    if user.role == 'manager':
        permissions = Permission.objects.filter(content_type=content_type, codename__in=['manage_library', 'view_books', 'edit_books'])
    elif user.role == 'librarian':
        permissions = Permission.objects.filter(content_type=content_type, codename__in=['view_books', 'edit_books'])
    else:
        permissions = Permission.objects.filter(content_type=content_type, codename__in=['view_books'])
    
    user.user_permissions.set(permissions)
    user.save()