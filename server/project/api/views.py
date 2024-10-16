from django.utils import timezone
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializer import *
from .models import Book
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
    search_query = request.GET.get('search', '')
    if search_query != '':
        books = Book.objects.filter(
            Q(library=request.user.library) &
            (Q(title__icontains=search_query) |
             Q(author__icontains=search_query) |
             Q(genre__icontains=search_query))
        )
    else:
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
        newBook = serializer.save()
        copies_available = request.data.get('copies_available', 0)
        try:
            copies_available = int(copies_available)
        except ValueError:
            return Response({'error': 'Invalid number of copies'}, status=status.HTTP_400_BAD_REQUEST)
        for _ in range(copies_available):
            BookCopy.objects.create(book=newBook, is_borrowed=False)
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_clients(request):
    search_query = request.GET.get('search', '')
    if search_query != '':
        clients = Client.objects.filter(
            Q(library=request.user.library) &
            Q(name__icontains=search_query)
        )
    else:
        clients = Client.objects.filter(library=request.user.library)
    serializedData = ClientSerializer(clients, many=True).data
    return Response(serializedData)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_client(request):
    data = request.data
    data['library'] = request.user.library.id
    serializer = ClientSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_copies(request, book_id):
    try:
        copies = BookCopy.objects.filter(book__library=request.user.library, book_id=book_id)
        copies_data = []
        for copy in copies:
            copy_data = {
                'id': copy.id,
                'is_borrowed': copy.is_borrowed,
                'borrowed_by': None
            }
            if copy.is_borrowed:
                borrow = Borrow.objects.filter(book_copy=copy, returned_at__isnull=True).first()
                if borrow:
                    client = Client.objects.get(id=borrow.client.id)
                    copy_data['borrowed_by'] = {
                        'id': client.id,
                        'name': client.name
                    }
            copies_data.append(copy_data)
        return Response(copies_data, status=status.HTTP_200_OK)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def borrow_copy(request):
    copy_id = request.data.get('copy_id')
    client_id = request.data.get('client_id')
    copy = BookCopy.objects.get(id=copy_id)
    client = Client.objects.get(id=client_id)
    if not copy.is_borrowed:
        borrow = Borrow.objects.create(client=client, book_copy=copy)
        copy.is_borrowed = True
        copy.save()
        serializedData = BorrowSerializer(borrow).data
        return Response(serializedData)
    else:
        return Response({'error': 'Copy is already borrowed'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def return_copy(request):
    copy_id = request.data.get('copy_id')
    copy = BookCopy.objects.get(id=copy_id)
    borrow = Borrow.objects.filter(book_copy=copy, returned_at__isnull=True).first()
    if borrow:
        borrow.returned_at = timezone.now()
        borrow.save()
        copy.is_borrowed = False
        copy.save()
        return Response({'success': 'Copy returned'})
    else:
        return Response({'error': 'Copy not found or already returned'}, status=400)