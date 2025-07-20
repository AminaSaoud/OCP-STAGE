<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Notifications\EnvoyerMotDePasse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;





class UtilisateurController extends Controller
{
    public function storeCollaborateur(Request $request)
    {
        $request->merge(['role' => 'collaborateur']);
        return $this->store($request);
    }

    public function storeControleurMagasin(Request $request)
    {
        $request->merge(['role' => 'controleur de magasin']);
        return $this->store($request);
    }

    public function storeControleurTechnique(Request $request)
    {
        $request->merge(['role' => 'controleur technique']);
        return $this->store($request);
    }

    private function store(Request $request)
{
    
   $admin = Auth::user(); // ou auth()->user();

    if (!$admin) {
        return response()->json(['message' => 'Utilisateur non authentifié'], 401);
    }

    $id_admin = $admin->id_admin;
    
    // Validation avec règles personnalisées
    $validator = Validator::make($request->all(), [
        'nom' => 'required|string|max:191|min:2',
        'prenom' => 'required|string|max:191|min:2',
        'email' => 'required|email|unique:utilisateur,email',
        'tel' => [
            'required',
            'string',
            'regex:/^(06|07|05)\d{8}$/',
            'max:10'
        ],
        'date_naissance' => 'nullable|date|before:today',
        'cin' => 'nullable|string|max:20|unique:utilisateur,cin',
        'date_prise_fonction' => 'nullable|date|before_or_equal:today',
        'service' => 'required|string|max:191',
        'fonction' => 'required|string|max:191',
        'matricule' => [
            'required',
            'string',
            'regex:/^[A-Z0-9]{6}$/',
            'unique:utilisateur,matricule'
        ],
        'role' => 'required|in:collaborateur,controleur de magasin,controleur technique'
    ], [
        'tel.regex' => 'Le format du téléphone doit être 06XXXXXXXX, 07XXXXXXXX ou 05XXXXXXXX',
        'matricule.regex' => 'Le matricule doit contenir exactement 6 caractères (lettres et chiffres)',
        'matricule.unique' => 'Ce matricule existe déjà',
        'nom.min' => 'Le nom doit contenir au moins 2 caractères',
        'prenom.min' => 'Le prénom doit contenir au moins 2 caractères',
        'date_naissance.before' => 'La date de naissance doit être antérieure à aujourd\'hui',
        'date_prise_fonction.before_or_equal' => 'La date de prise de fonction ne peut pas être dans le futur',
        'cin.unique' => 'Ce CIN existe déjà'
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Validation échouée', 'errors' => $validator->errors()], 422);
    }

    $motdepasse = Str::random(10);

    do {
        $id_utilisateur = Str::upper(Str::random(10));
    } while (Utilisateur::where('id_utilisateur', $id_utilisateur)->exists());

    // S'assurer que les données sont en majuscules
    $utilisateur = Utilisateur::create([
        'id_utilisateur' => $id_utilisateur,
        'nom' => strtoupper(trim($request->nom)),
        'prenom' => strtoupper(trim($request->prenom)),
        'email' => strtolower(trim($request->email)),
        'mdp' => Hash::make($motdepasse),
        'tel' => trim($request->tel),
        'date_naissance' => $request->date_naissance,
        'cin' => $request->cin ? strtoupper(trim($request->cin)) : null,
        'date_prise_fonction' => $request->date_prise_fonction,
        'service' => trim($request->service),
        'fonction' => trim($request->fonction),
        'matricule' => strtoupper(trim($request->matricule)),
        'role' => $request->role,
        'id_admin' => $id_admin,
        'actif' => true,
        'must_change_password' => true, // Ajout ici
    ]);

    $utilisateur->notify(new EnvoyerMotDePasse($motdepasse));

    return response()->json([
        'message' => 'Utilisateur ajouté avec succès. Un email a été envoyé.',
        'data' => $utilisateur
    ], 201);
}


    public function getByRole($role)
    {
        $roles = ['collaborateur', 'controleur de magasin', 'controleur technique'];
        if (!in_array($role, $roles)) {
            return response()->json(['message' => 'Rôle invalide'], 400);
        }

        $utilisateurs = Utilisateur::where('role', $role)->where('actif', true)->get();
        return response()->json(['data' => $utilisateurs]);
    }

    public function desactiver($id)
    {
        $u = Utilisateur::find($id);
        if (!$u) return response()->json(['message' => 'Utilisateur introuvable'], 404);

        $u->actif = false;
        $u->save();

        return response()->json(['message' => 'Utilisateur désactivé (archivé).']);
    }

    public function reactiver($id)
    {
        $u = Utilisateur::find($id);
        if (!$u) return response()->json(['message' => 'Utilisateur introuvable'], 404);

        $u->actif = true;
        $u->save();

        return response()->json(['message' => 'Utilisateur réactivé.']);
    }

    public function archives()
    {
        $utilisateurs = Utilisateur::where('actif', false)->get();
        return response()->json(['data' => $utilisateurs]);
    }

    public function update(Request $request, $id)
    {
        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|required|string|max:191|min:2',
            'prenom' => 'sometimes|required|string|max:191|min:2',
            'email' => 'sometimes|required|email|unique:utilisateur,email,' . $id . ',id_utilisateur',
            'mdp' => 'nullable|string|min:6',
            'tel' => [
                'sometimes',
                'required',
                'string',
                'regex:/^(06|07|05)\d{8}$/',
                'max:10'
            ],
            'date_naissance' => 'sometimes|nullable|date|before:today',
            'cin' => 'sometimes|nullable|string|max:20|unique:utilisateur,cin,' . $id . ',id_utilisateur',
            'date_prise_fonction' => 'sometimes|nullable|date|before_or_equal:today',
            'service' => 'sometimes|required|string|max:191',
            'fonction' => 'sometimes|required|string|max:191',
            'matricule' => [
                'sometimes',
                'required',
                'string',
                'regex:/^[A-Z0-9]{6}$/',
                'unique:utilisateur,matricule,' . $id . ',id_utilisateur'
            ],
            'role' => 'sometimes|required|in:collaborateur,controleur de magasin,controleur technique'
        ], [
            'tel.regex' => 'Le format du téléphone doit être 06XXXXXXXX, 07XXXXXXXX ou 05XXXXXXXX',
            'matricule.regex' => 'Le matricule doit contenir exactement 6 caractères (lettres et chiffres)',
            'matricule.unique' => 'Ce matricule existe déjà',
            'nom.min' => 'Le nom doit contenir au moins 2 caractères',
            'prenom.min' => 'Le prénom doit contenir au moins 2 caractères',
            'date_naissance.before' => 'La date de naissance doit être antérieure à aujourd\'hui',
            'date_prise_fonction.before_or_equal' => 'La date de prise de fonction ne peut pas être dans le futur',
            'cin.unique' => 'Ce CIN existe déjà'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Échec de validation', 'errors' => $validator->errors()], 422);
        }

        // Traiter les données avant de les sauvegarder
        $data = $request->except(['mdp']);
        
        // Formater les données
        if (isset($data['nom'])) {
            $data['nom'] = strtoupper(trim($data['nom']));
        }
        if (isset($data['prenom'])) {
            $data['prenom'] = strtoupper(trim($data['prenom']));
        }
        if (isset($data['email'])) {
            $data['email'] = strtolower(trim($data['email']));
        }
        if (isset($data['tel'])) {
            $data['tel'] = trim($data['tel']);
        }
        if (isset($data['date_naissance'])) {
            $data['date_naissance'] = $data['date_naissance'];
        }
        if (isset($data['cin'])) {
            $data['cin'] = $data['cin'] ? strtoupper(trim($data['cin'])) : null;
        }
        if (isset($data['date_prise_fonction'])) {
            $data['date_prise_fonction'] = $data['date_prise_fonction'];
        }
        if (isset($data['service'])) {
            $data['service'] = trim($data['service']);
        }
        if (isset($data['fonction'])) {
            $data['fonction'] = trim($data['fonction']);
        }
        if (isset($data['matricule'])) {
            $data['matricule'] = strtoupper(trim($data['matricule']));
        }

        $utilisateur->fill($data);

        if ($request->filled('mdp')) {
            $utilisateur->mdp = Hash::make($request->mdp);
        }

        $utilisateur->updated_at = now();
        $utilisateur->save();

        return response()->json(['message' => 'Utilisateur mis à jour avec succès.', 'data' => $utilisateur], 200);
    }
    public function show($id)
{
    $utilisateur = Utilisateur::find($id);
    if (!$utilisateur) {
        return response()->json(['message' => 'Utilisateur introuvable.'], 404);
    }
    return response()->json($utilisateur);
}
}