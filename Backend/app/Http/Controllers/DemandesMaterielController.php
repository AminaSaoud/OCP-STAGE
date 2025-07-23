<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\Materiel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DemandesMaterielController extends Controller
{
    /**
     * Retourner toutes les demandes à traiter par le responsable de matériel
     */
    public function index()
    {
        $demandes = Demande::whereIn('etat', ['valide_technique', 'materiel_indispo'])->get();
        return response()->json(['demandes' => $demandes]);
    }

    /**
     * Afficher le détail d'une demande
     */
    public function show($id)
    {
        $demande = Demande::findOrFail($id);
        return response()->json(['demande' => $demande]);
    }

    /**
     * Affecter un matériel à une demande
     */
    public function affecterMateriel(Request $request, $id_demande)
    {
        $request->validate([
            'materiel_id' => 'required|exists:materiel,id_m',
            'date_rec' => 'required|date'
        ]);

        $demande = Demande::findOrFail($id_demande);
        $materiel = Materiel::where('id_m', $request->materiel_id)->where('etat', 'disponible')->firstOrFail();

        $user = Auth::user();
        $demande->materiel_id = $materiel->id_m;
        $demande->date_rec = $request->date_rec;
        $demande->date_mag = now();
        $demande->id_mag = $user ? $user->id_utilisateur : null;
        $demande->etat = 'valide';
        $demande->save();

        $materiel->etat = 'indisponible';
        $materiel->date_S = $request->date_rec;
        $materiel->save();

        return response()->json([
            'success' => true,
            'message' => 'Matériel affecté à la demande avec succès.',
            'demande' => $demande
        ]);
    }

    /**
     * Signaler que le matériel est indisponible pour une demande
     */
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

    /**
     * Rechercher des matériels disponibles par type et mot-clé
     */
    public function rechercherMateriel(Request $request)
    {
        $query = Materiel::query()->where('etat', 'disponible');

        if ($request->filled('type')) {
            $query->where('type_materiel', $request->type);
        }
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function($sub) use ($q) {
                $sub->where('designation', 'like', "%$q%")
                     ->orWhere('description', 'like', "%$q%") ;
            });
        }

        $materiels = $query->get();
        return response()->json(['materiels' => $materiels]);
    }
} 