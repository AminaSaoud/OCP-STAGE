<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminAuthController;

Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});




// Routes d'authentification admin (non protégées)
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// Routes protégées pour les administrateurs
Route::middleware(['auth:sanctum'])->group(function () {
    // Déconnexion admin
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    
    // Récupérer les informations de l'admin connecté
    Route::get('/admin/user', [AdminAuthController::class, 'adminUser']);
    
    // Vérifier l'accès administrateur
    Route::get('/admin/check-access', [AdminAuthController::class, 'checkAdminAccess']);
});

// Middleware personnalisé pour protéger les routes admin
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Toutes vos routes d'administration ici
    // Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    // Route::resource('/admin/users', AdminUserController::class);
    // etc.
});