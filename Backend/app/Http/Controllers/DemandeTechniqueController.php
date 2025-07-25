<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Demande;
use Illuminate\Support\Facades\Auth;
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
        $demande->id_tech = Auth::user()->id_utilisateur;
        $demande->save();
        return response()->json(['success' => true, 'message' => 'Demande validée avec succès.']);
    }

    public function rejeter($id, Request $request)
    {
        $demande = Demande::findOrFail($id);
        $demande->etat = 'refuse';
        $demande->id_tech = Auth::user()->id_utilisateur;
        $demande->motif_refus = $request->motif_refus; // ou $request->input('motif_refus')
        $demande->save();
        return response()->json(['success' => true, 'message' => 'Demande refusée avec succès.']);
    }

    public function historiqueTech()
    {
        $demandes = \App\Models\Demande::whereIn('etat', [
                'valide_technique', 'valide', 'materiel_indispo', 'en_affectation', 'refuse'
            ])
            ->leftJoin('utilisateur as tech', 'demande.id_tech', '=', 'tech.id_utilisateur')
            ->select(
                'demande.*',
                'tech.nom as tech_nom',
                'tech.prenom as tech_prenom'
            )
            ->orderBy('date_demande', 'desc')
            ->get();

        return response()->json(['demandes' => $demandes]);
    }
}