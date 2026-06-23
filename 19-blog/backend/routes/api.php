<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;

// Route paths here mirror the fetch() URL literals in
// frontend/src/api.ts so adorable can stitch callers to endpoints.
Route::group(['prefix' => 'api'], function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);

    Route::post('/posts/{id}/comments', [CommentController::class, 'store']);
});
