<?php
namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->mdp)) {
            throw ValidationException::withMessages([
                'email' => ['Les informations d\'identification administrateur sont incorrectes.'],
            ]);
        }

        // Vérifier que l'utilisateur a bien le rôle admin
        if ($admin->role !== 'admin') {
            throw ValidationException::withMessages([
                'email' => ['Accès non autorisé. Vous n\'avez pas les privilèges administrateur.'],
            ]);
        }

        return response()->json([
            'token' => $admin->createToken('admin_auth_token')->plainTextToken,
            'admin' => [
                'id' => $admin->id_admin,
                'nom' => $admin->nom,
                'prenom' => $admin->prenom,
                'email' => $admin->email,
                'tel' => $admin->tel,
                'role' => $admin->role,
                'full_name' => $admin->prenom . ' ' . $admin->nom
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion administrateur réussie']);
    }

    public function adminUser(Request $request)
    {
        $admin = $request->user();
        
        // Vérifier que l'utilisateur connecté est bien un admin
        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'Accès non autorisé'], 403);
        }

        return response()->json([
            'id' => $admin->id_admin,
            'nom' => $admin->nom,
            'prenom' => $admin->prenom,
            'email' => $admin->email,
            'tel' => $admin->tel,
            'role' => $admin->role,
            'full_name' => $admin->prenom . ' ' . $admin->nom
        ]);
    }

    public function checkAdminAccess(Request $request)
    {
        $admin = $request->user();
        
        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['error' => 'Accès administrateur requis'], 403);
        }

        return response()->json(['status' => 'authorized']);
    }
}