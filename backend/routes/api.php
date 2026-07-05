<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Public routes
    Route::get('categories', [CategoryController::class, 'index']);

    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{product}', [ProductController::class, 'show']);

    Route::post('orders', [OrderController::class, 'store'])
        ->middleware('throttle:10,1'); // Rate limit: 10 requests per minute
    Route::get('orders/{order}', [OrderController::class, 'show']);

    // Image upload endpoint
    Route::post('upload-image', [ImageController::class, 'upload']);

    // Admin routes (require bearer token)
    Route::prefix('admin')->middleware('auth.admin')->group(function () {
        Route::post('products', [ProductController::class, 'store']);
        Route::put('products/{product}', [ProductController::class, 'update']);
        Route::delete('products/{product}', [ProductController::class, 'destroy']);

        Route::get('orders', [OrderController::class, 'index']);
    });
});
