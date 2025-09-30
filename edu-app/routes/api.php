<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BookTocController;
use App\Http\Controllers\AnnotationsController;
use App\Http\Controllers\UserBookPageController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::get('/books/pages/{book}/{filename}', [BookController::class, 'servePage']);
    Route::get('/books/audio/{book}/{filename}', [BookController::class, 'serveAudio']);
    Route::get('/my-books', [BookController::class, 'listMyBooks']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);

    Route::get('/books/{book}/toc', [BookTocController::class, 'index']);

    Route::get('/books/{bookId}/annotations', [AnnotationsController::class, 'getBookAnnotations']);
    Route::post('/books/{bookId}/annotations', [AnnotationsController::class, 'saveAnnotations']);
    Route::get('/books/{bookId}/annotations/{pageNumber}', [AnnotationsController::class, 'getPageAnnotations']);
    Route::delete('/books/{bookId}/annotations/{pageNumber}', [AnnotationsController::class, 'clearPageAnnotations']);
    Route::delete('/books/{bookId}/annotations', [AnnotationsController::class, 'clearBookAnnotations']);
    Route::delete('/books/{bookId}/annotations/{pageNumber}/path', [AnnotationsController::class, 'deleteAnnotationPath']);

    Route::get('/user-book-pages/{userId}/{bookId}', [UserBookPageController::class, 'getUserBookPages']);
    Route::post('/user-book-pages', [UserBookPageController::class, 'store']);
    Route::put('/user-book-pages/{id}', [UserBookPageController::class, 'update']);
    Route::delete('/user-book-pages/{id}', [UserBookPageController::class, 'destroy']);

    Route::middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/give-book-access', [UserController::class, 'giveBookAccess']);
        Route::post('/users/remove-book-access', [UserController::class, 'removeBookAccess']);

        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{id}', [BookController::class, 'update']);
        Route::post('/books/{id}', [BookController::class, 'update']);
        Route::delete('/books/{id}', [BookController::class, 'destroy']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/books/{book}/toc', [BookTocController::class, 'store']);
        Route::put('/books/{book}/toc/{toc}', [BookTocController::class, 'update']);
        Route::delete('/books/{book}/toc/{toc}', [BookTocController::class, 'destroy']);
    });

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
