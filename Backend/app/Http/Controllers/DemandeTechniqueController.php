<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Demande;

class DemandeTechniqueController extends Controller
{
    public function index(Request $request)
    {
        $query = Demande::query();

        // Filtre par catégorie
        if ($request->filled('categorie')) {
            $query->where('categorie', $request->categorie);
        }
        // Filtre par importance
       

        // Seulement les demandes en attente
        $query->where('etat', 'en_attente');

        // Tri par date croissante (plus ancienne d'abord)
        $query->orderBy('created_at', 'asc');

        $demandes = $query->with('collaborateur')->get();

        return response()->json([
            'success' => true,
            'demandes' => $demandes
        ]);
    }

    public function show($id)
    {
        $demande = Demande::with('collaborateur')->findOrFail($id);
        return response()->json(['success' => true, 'demande' => $demande]);
    }

    public function accepter($id)
    {
        $demande = Demande::findOrFail($id);
        $demande->etat = 'valide_technique';
        $demande->date_tech = now();
        $demande->save();
        return response()->json(['success' => true, 'message' => 'Demande validée avec succès.']);
    }

    public function rejeter($id, Request $request)
    {
        $demande = Demande::findOrFail($id);
        $demande->etat = 'refuse';
        $demande->motif_refus = $request->motif_refus; // ou $request->input('motif_refus')
        $demande->save();
        return response()->json(['success' => true, 'message' => 'Demande refusée avec succès.']);
    }
}