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

// Semua user yang sudah login (student & admin)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Route umum (student + admin)
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::get('/my-books', [BookController::class, 'listMyBooks']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/books/{book}/toc', [BookTocController::class, 'index']);
    Route::get('/books/{bookId}/annotations', [AnnotationsController::class, 'getBookAnnotations']);
    // dst...

    // Route khusus admin
    Route::middleware('role:admin')->group(function () {
        // Books
        Route::post('/books', [BookController::class, 'store']);
        Route::put('/books/{id}', [BookController::class, 'update']);
        Route::delete('/books/{id}', [BookController::class, 'destroy']);

        // Categories
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Users
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
