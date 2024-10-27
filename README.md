This project is a library management website. It allows its users to manage books, clients, and library staff efficiently. The system includes features for user authentication, book management, client management, and staff management.

In the Frontend, I have used:
- React for building user interfaces.
- React Context API For managing global states.
- PicoCSS for styling.

In the Backend, I have used:
- Django and Django REST Framework for building the Web APIs.
- JWT for the authentication.

Features:
- User Authentication and Staff Management: Manage library staff, including roles and permissions - the managers of the library can add workers of various roles to their library - managers, librarians, and workers, each with their own permissions.
- Book Management: Add, update, and delete books in the library, allowing librarians to mark the books as borrowed by clients, and returned. 
- Client Management: Manage library clients, including adding and viewing client details.

To run this project follow these steps:

1. clone the repository:
git clone https://github.com/ofirbeck/library-management-website
cd library-management-website

2. Install dependencies:
- inside the client/app folder(since this project uses vite):
   yarn install
- inside the server folder:
  pip install -r requirements.txt

3. run the backend server - inside server/api run:
  python manage.py runserver

4. run the frontend development server - inside client/app run:
  yarn dev
