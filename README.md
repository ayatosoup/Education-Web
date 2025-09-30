## EDU WEB
Education Website for School

## Overview
Education-Web is a comprehensive platform designed to facilitate online learning for students and educators. It provides a user-friendly interface and a variety of resources to enhance the educational experience.

## Features
- User authentication
- Book management system
- Resource library with prevented downloadable materials
- Book player and editor

## Installation Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/Education-Web.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Education-Web
    ```
3. Install the required dependencies:
    ```bash
    npm install
    composer install
    ```
4. Start the development server:
    ```bash
    npm start
    php artisan serve
    ```

## Usage
After installation, open your web browser and navigate to `http://localhost:3000` to access the application. Follow the on-screen instructions to register and start using the platform.

## API Endpoints
- `GET /api/users` - Retrieve user information
- `POST /api/login` - Authenticate a user
/**
 * @api {post} /login Login
 * @apiDescription Logs in a user and returns an authentication token.
 * @apiGroup Authentication
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 * @apiSuccess {String} token Authentication token.
 */
Route::post('/login', [AuthController::class, 'login']);

/**
 * @api {post} /logout Logout
 * @apiDescription Logs out the authenticated user.
 * @apiGroup Authentication
 * @apiHeader {String} Authorization Bearer token.
 * @apiSuccess {String} message Success message.
 */
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

/**
 * @api {get} /users Get All Users
 * @apiDescription Fetches a list of all users.
 * @apiGroup Users
 * @apiSuccess {Object[]} users List of users.
 */
Route::get('/users', [UserController::class, 'index']);

/**
 * @api {get} /users/:id Get User by ID
 * @apiDescription Fetches details of a specific user.
 * @apiGroup Users
 * @apiParam {Number} id User's unique ID.
 * @apiSuccess {Object} user User details.
 */
Route::get('/users/{id}', [UserController::class, 'show']);

/**
 * @api {post} /users Create User
 * @apiDescription Creates a new user.
 * @apiGroup Users
 * @apiParam {String} name User's name.
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 * @apiSuccess {Object} user Created user details.
 */
Route::post('/users', [UserController::class, 'store']);

/**
 * @api {put} /users/:id Update User
 * @apiDescription Updates an existing user's details.
 * @apiGroup Users
 * @apiParam {Number} id User's unique ID.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [email] User's email.
 * @apiParam {String} [password] User's password.
 * @apiSuccess {Object} user Updated user details.
 */
Route::put('/users/{id}', [UserController::class, 'update']);

/**
 * @api {delete} /users/:id Delete User
 * @apiDescription Deletes a user.
 * @apiGroup Users
 * @apiParam {Number} id User's unique ID.
 * @apiSuccess {String} message Success message.
 */
Route::delete('/users/{id}', [UserController::class, 'destroy']);

/**
 * @api {post} /users/give-book-access Grant Book Access
 * @apiDescription Grants a user access to a specific book.
 * @apiGroup Users
 * @apiParam {Number} user_id User's unique ID.
 * @apiParam {Number} book_id Book's unique ID.
 * @apiSuccess {String} message Success message.
 */
Route::post('/users/give-book-access', [UserController::class, 'giveBookAccess']);

/**
 * @api {post} /users/remove-book-access Revoke Book Access
 * @apiDescription Revokes a user's access to a specific book.
 * @apiGroup Users
 * @apiParam {Number} user_id User's unique ID.
 * @apiParam {Number} book_id Book's unique ID.
 * @apiSuccess {String} message Success message.
 */
Route::post('/users/remove-book-access', [UserController::class, 'removeBookAccess']);

/**
 * @api {get} /users/:id/books List User's Books
 * @apiDescription Lists all books a user has access to.
 * @apiGroup Users
 * @apiParam {Number} id User's unique ID.
 * @apiSuccess {Object[]} books List of books.
 */
Route::get('/users/{id}/books', [UserController::class, 'listUserBooks']);

/**
 * @api {post} /users/sync-book-access Sync Book Access
 * @apiDescription Synchronizes a user's book access with a given list of book IDs.
 * @apiGroup Users
 * @apiParam {Number} user_id User's unique ID.
 * @apiParam {Number[]} book_ids Array of book IDs.
 * @apiSuccess {String} message Success message.
 */
Route::post('/users/sync-book-access', [UserController::class, 'syncBookAccess']);

/**
 * @api {get} /books Get All Books
 * @apiDescription Fetches a list of all books.
 * @apiGroup Books
 * @apiSuccess {Object[]} books List of books.
 */
Route::get('/books', [BookController::class, 'index']);

/**
 * @api {get} /books/:id Get Book by ID
 * @apiDescription Fetches details of a specific book.
 * @apiGroup Books
 * @apiParam {Number} id Book's unique ID.
 * @apiSuccess {Object} book Book details.
 */
Route::get('/books/{id}', [BookController::class, 'show']);

/**
 * @api {post} /books Create Book
 * @apiDescription Creates a new book.
 * @apiGroup Books
 * @apiParam {String} title Book's title.
 * @apiParam {String} [description] Book's description.
 * @apiParam {File} pdf_file Book's PDF file.
 * @apiSuccess {Object} book Created book details.
 */
Route::post('/books', [BookController::class, 'store']);

/**
 * @api {put} /books/:id Update Book
 * @apiDescription Updates an existing book's details.
 * @apiGroup Books
 * @apiParam {Number} id Book's unique ID.
 * @apiParam {String} [title] Book's title.
 * @apiParam {String} [description] Book's description.
 * @apiParam {File} [pdf_file] Book's PDF file.
 * @apiSuccess {Object} book Updated book details.
 */
Route::put('/books/{id}', [BookController::class, 'update']);

/**
 * @api {delete} /books/:id Delete Book
 * @apiDescription Deletes a book.
 * @apiGroup Books
 * @apiParam {Number} id Book's unique ID.
 * @apiSuccess {String} message Success message.
 */
Route::delete('/books/{id}', [BookController::class, 'destroy']);
