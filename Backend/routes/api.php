<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\DemandeTechniqueController;


use App\Http\Controllers\UtilisateurController;


Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/force-change-password', [AuthController::class, 'forceChangePassword']);
});




// Routes d'authentification admin (non protégées)
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// Routes protégées pour les administrateurs
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Déconnexion admin
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    
    // Récupérer les informations de l'admin connecté
    Route::get('/admin/user', [AdminAuthController::class, 'adminUser']);
    
    // Vérifier l'accès administrateur
    Route::get('/admin/check-access', [AdminAuthController::class, 'checkAdminAccess']);


    
    /*
    |--------------------------------------------------------------------------
    | Gestion des utilisateurs (par l’admin)
    |--------------------------------------------------------------------------
    */
    // 👤 Ajouter un utilisateur selon le rôle
    Route::post('/utilisateurs/collaborateur', [UtilisateurController::class, 'storeCollaborateur']);
    Route::post('/utilisateurs/magasin', [UtilisateurController::class, 'storeControleurMagasin']);
    Route::post('/utilisateurs/technique', [UtilisateurController::class, 'storeControleurTechnique']);

    // 📋 Lire les utilisateurs par rôle ou archivés
    Route::get('/utilisateurs/role/{role}', [UtilisateurController::class, 'getByRole']);
    Route::get('/utilisateurs/archives', [UtilisateurController::class, 'archives']);

    // 🚫 Activer / désactiver
    Route::put('/utilisateurs/{id}/desactiver', [UtilisateurController::class, 'desactiver']);
    Route::put('/utilisateurs/{id}/reactiver', [UtilisateurController::class, 'reactiver']);

    // ✏️ Modifier un utilisateur
    Route::put('/utilisateurs/{id}', [UtilisateurController::class, 'update']);

    // 👤 Récupérer un utilisateur par son id
    Route::get('/utilisateurs/{id}', [UtilisateurController::class, 'show']);

    Route::get('/test-admin', function () {
        return response()->json(['message' => 'Accès admin OK']);
    });
});






// Routes protégées par authentification Sanctum
Route::middleware('auth:sanctum')->group(function () {
    
    // Routes pour les demandes
    Route::prefix('demandes')->group(function () {
        Route::post('/', [DemandeController::class, 'store']); // Soumettre une demande
        Route::get('/', [DemandeController::class, 'getUserDemandes']); // Récupérer les demandes de l'utilisateur
        Route::get('/{id}', [DemandeController::class, 'show']); // Récupérer une demande spécifique
    });
    
});


Route::prefix('tech')->middleware(['auth:sanctum','tech.controleur'])->group(function () {
    Route::get('/demandes', [DemandeTechniqueController::class, 'index']);
    Route::get('/demandes/{id}', [DemandeTechniqueController::class, 'show']);
    Route::post('/demandes/{id}/accepter', [DemandeTechniqueController::class, 'accepter']);
    Route::post('/demandes/{id}/rejeter', [DemandeTechniqueController::class, 'rejeter']);
});


