from rest_framework import serializers
from .utils import assign_permissions
from .models import Book, Borrow, User, Library

class LibraryAdminSerializer(serializers.Serializer):
    library_name = serializers.CharField(max_length=255)
    library_address = serializers.CharField(max_length=255)
    admin_username = serializers.CharField(max_length=150)
    admin_password = serializers.CharField(write_only=True)
    def create(self, validated_data):
        library = Library.objects.create(
            name=validated_data['library_name'],
            address=validated_data['library_address']
        )
        admin_user = User.objects.create_user(
            username=validated_data['admin_username'],
            password=validated_data['admin_password'],
            library=library,
            role='manager',
            is_staff=True,
            is_superuser=False,
            is_active=True
        )
        assign_permissions(admin_user)
        return library


class LibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Library
        fields = '__all__'
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class BorrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Borrow
        fields = '__all__'