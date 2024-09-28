from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import BookSerializer
from .models import Book
from .constants import GENRE_CHOICES

@api_view(['GET'])
def get_genre_list(request):
    genres = [genre[0] for genre in GENRE_CHOICES]
    return Response(genres)

@api_view(['GET'])
def get_book_list(request):
    books = Book.objects.all()
    serializedData = BookSerializer(books, many=True).data
    return Response(serializedData)


@api_view(['POST'])
def create_new_book(request):
    data = request.data
    serializer = BookSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def update_book(request, pk):
    try:
        selectedBook = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        data = request.data
        serializer = BookSerializer(selectedBook, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    elif request.method == 'DELETE':
        selectedBook.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)
