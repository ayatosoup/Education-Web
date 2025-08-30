<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UploadController;

// Remove or comment out the welcome route
// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/users', [UserController::class, 'index']);
Route::get('/upload-pdf', [UploadController::class, 'showForm'])->name('upload.form');
Route::post('/upload-pdf', [UploadController::class, 'handleUpload'])->name('upload.submit');

// Add this catch-all route at the END (very important it's last)
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');