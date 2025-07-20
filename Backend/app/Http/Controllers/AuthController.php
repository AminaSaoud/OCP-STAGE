<?php
namespace App\Http\Controllers;


use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->mdp)) {
            throw ValidationException::withMessages([
                'email' => ['Les informations d\'identification sont incorrectes.'],
            ]);
        }

        // Vérification du statut actif
    if (!$user->actif) {
        throw ValidationException::withMessages([
            'email' => ['Ce compte est désactivé. Veuillez contacter un administrateur.'],
        ]);
    }

    // Vérification du changement de mot de passe obligatoire
    if ($user->must_change_password) {
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'must_change_password' => true,
            'token' => $token
        ], 200);
    }

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }





    

    public function forceChangePassword(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'old_password' => 'required',
        'new_password' => [
            'required',
            'confirmed',
            'min:8',
            'regex:/[a-z]/',      // minuscule
            'regex:/[A-Z]/',      // majuscule
            'regex:/[0-9]/',      // chiffre
            'regex:/[@$!%*#?&]/', // caractère spécial
        ],
    ]);

    $user = Utilisateur::where('email', $request->email)->first();
    if (!$user || !Hash::check($request->old_password, $user->mdp)) {
        return response()->json(['message' => 'Ancien mot de passe incorrect'], 401);
    }

    $user->mdp = Hash::make($request->new_password);
    $user->must_change_password = false;
    $user->save();

    return response()->json(['message' => 'Mot de passe changé avec succès']);
}

}
