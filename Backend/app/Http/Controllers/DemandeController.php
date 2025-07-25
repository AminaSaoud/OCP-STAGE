<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DemandeController extends Controller
{
    /**
     * Soumettre une nouvelle demande
     */
    public function store(Request $request)
    {
        try {
            // Validation des données
            $request->validate([
                'categorie' => 'required|in:chantier,informatique,climatisation,électroménager,mobilier,logistique,sécurité,technique,autre',
                'designation' => 'required|string|max:191',
                'description' => 'required|string',
                'justification_file' => 'required|file|mimes:pdf,xlsx,xls,doc,docx|max:5120', // 5MB max
                'quantite' => 'required|integer|min:1',
                'type' => 'required|in:mobilisable,immobilisable',
            ]);

            // Récupérer l'utilisateur connecté
            $user = Auth::user();
            
            if (!$user) {
                throw ValidationException::withMessages([
                    'auth' => ['Utilisateur non authentifié.'],
                ]);
            }

            // Générer un ID unique pour la demande
            $id_demande = $this->generateDemandeId();

            // Gérer l'upload du fichier de justification
            $justificationPath = null;
            if ($request->hasFile('justification_file')) {
                $file = $request->file('justification_file');
                $filename = $id_demande . '_justification_' . time() . '.' . $file->getClientOriginalExtension();
                $justificationPath = $file->storeAs('justifications', $filename, 'public');
            }

            // Créer la demande
            $demande = Demande::create([
                'id_demande' => $id_demande,
                'categorie' => $request->categorie,
                'designation' => $request->designation,
                'description' => $request->description,
                'justification' => $justificationPath,
                'id_collaborateur' => $user->id_utilisateur,
                'etat' => 'en_attente',
                'disponible' => false,
                'quantite' => $request->quantite,
                'type' => $request->type,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Demande soumise avec succès',
                'demande' => $demande,
                'id_demande' => $id_demande
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la soumission de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les demandes de l'utilisateur connecté
     */
    public function getUserDemandes()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                throw ValidationException::withMessages([
                    'auth' => ['Utilisateur non authentifié.'],
                ]);
            }

            $demandes = Demande::where('id_collaborateur', $user->id_utilisateur)
                              ->orderBy('date_demande', 'desc')
                              ->get();

            return response()->json([
                'success' => true,
                'demandes' => $demandes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des demandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Générer un ID unique pour la demande
     */
    private function generateDemandeId()
    {
        do {
            $id = 'DEM' . str_pad(rand(1, 9999999), 7, '0', STR_PAD_LEFT);
        } while (Demande::where('id_demande', $id)->exists());

        return $id;
    }

    /**
     * Récupérer une demande spécifique
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            
            $demande = Demande::where('id_demande', $id)
                             ->where('id_collaborateur', $user->id_utilisateur)
                             ->first();

            if (!$demande) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'demande' => $demande
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function affecterMateriel(Request $request, $id_demande)
    {
        $request->validate([
            'materiel_id' => 'required|exists:materiel,id_m',
            'date_rec' => 'required|date'
        ]);

        $demande = Demande::findOrFail($id_demande);
        // Assuming Materiel model exists and has 'id_m' and 'etat' columns
        // and that the 'disponible' status is managed by the 'etat' column.
        // For simplicity, we'll assume 'disponible' means 'etat = "disponible"'
        // and 'indisponible' means 'etat = "indisponible"'.
        // The original code had 'disponible' => false, which is now handled by 'etat'.
        // We need to ensure the materiel is available.
        $materiel = Materiel::where('id_m', $request->materiel_id)->where('etat', 'disponible')->firstOrFail();

        // Mettre à jour la demande
        $demande->materiel_id = $materiel->id_m;
        $demande->date_rec = $request->date_rec;
        $demande->date_mag = now();
        $demande->etat = 'valide';
        $demande->save();

        // Mettre à jour le matériel
        $materiel->etat = 'indisponible';
        $materiel->date_S = $request->date_rec;
        $materiel->save();

        return response()->json([
            'success' => true,
            'message' => 'Matériel affecté à la demande avec succès.',
            'demande' => $demande
        ]);
    }

    public function signalerMaterielIndisponible($id_demande)
    {
        $demande = Demande::findOrFail($id_demande);
        $demande->etat = 'materiel_indispo';
        $demande->save();

        return response()->json([
            'success' => true,
            'message' => 'Demande mise à jour : matériel indisponible.',
            'demande' => $demande
        ]);
    }
}