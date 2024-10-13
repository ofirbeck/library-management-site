from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializer import BookSerializer, UserSerializer, LibraryAdminSerializer, LibrarySerializer
from .models import Book, Library, User
from .constants import GENRE_CHOICES

@api_view(['POST'])
@permission_classes([AllowAny])
def create_new_library_and_its_admin(request):
    data = request.data
    serializer = LibraryAdminSerializer(data=data)
    if serializer.is_valid():
        library = serializer.save()
        return Response(LibrarySerializer(library).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data['username']
    password = request.data['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_genre_list(request):
    genres = [genre[0] for genre in GENRE_CHOICES]
    return Response(genres)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_book_list(request):
    books = Book.objects.filter(library=request.user.library)
    serializedData = BookSerializer(books, many=True).data
    return Response(serializedData)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_book(request):
    data = request.data
    data['library'] = request.user.library.id
    serializer = BookSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_book(request, pk):
    try:
        selectedBook = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        data = request.data
        data['library'] = request.user.library.id
        serializer = BookSerializer(selectedBook, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    elif request.method == 'DELETE':
        selectedBook.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)
