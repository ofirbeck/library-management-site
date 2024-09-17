from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import BookSerializer
from .models import Book


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
