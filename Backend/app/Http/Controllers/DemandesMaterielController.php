<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\Materiel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Historique;

class DemandesMaterielController extends Controller
{
    /**
     * Retourner toutes les demandes à traiter par le responsable de matériel
     */
    public function index()
    {
        $demandes = Demande::whereIn('etat', ['valide_technique', 'materiel_indispo', 'en_affectation'])->get();
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
        $demande->date_rec = $request->date_rec;
        $demande->date_mag = now();
        $demande->id_mag = $user ? $user->id_utilisateur : null;
        // On passe à en_affectation si ce n'est pas déjà le cas
        if (!in_array($demande->etat, ['en_affectation', 'valide'])) {
            $demande->etat = 'en_affectation';
        }
        $demande->save();

        $materiel->etat = 'indisponible';
        $materiel->date_S = $request->date_rec;
        $materiel->save();

        // Ajout dans la table historique
        $id_historique = $this->generateHistoriqueId();
        Historique::create([
            'id_historique' => $id_historique,
            'id_demande' => $demande->id_demande,
            'id_m' => $materiel->id_m
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Matériel affecté à la demande (en cours d\'affectation).',
            'demande' => $demande
        ]);
    }

    public function validerDemande($id_demande)
    {
        $demande = Demande::findOrFail($id_demande);
        $demande->etat = 'valide';
        $demande->save();

        return response()->json([
            'success' => true,
            'message' => 'Demande validée avec succès.',
            'demande' => $demande
        ]);
    }

    private function generateHistoriqueId()
    {
        do {
            $id = 'HIST' . str_pad(rand(1, 9999999), 7, '0', STR_PAD_LEFT);
        } while (\App\Models\Historique::where('id_historique', $id)->exists());
        return $id;
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
     * Affecter plusieurs matériels à une demande
     */
    public function affecterMateriels(Request $request, $id_demande)
    {
        $request->validate([
            'materiels' => 'required|array|min:1',
            'materiels.*.id_m' => 'required|exists:materiel,id_m',
            'materiels.*.date_rec' => 'required|date',
            'validation_finale' => 'boolean'
        ]);

        $demande = Demande::findOrFail($id_demande);
        $user = Auth::user();

        foreach ($request->materiels as $item) {
            $materiel = Materiel::where('id_m', $item['id_m'])->where('etat', 'disponible')->firstOrFail();

            $materiel->etat = 'indisponible';
            $materiel->date_S = $item['date_rec'];
            $materiel->save();

            $id_historique = $this->generateHistoriqueId();
            Historique::create([
                'id_historique' => $id_historique,
                'id_demande' => $demande->id_demande,
                'id_m' => $materiel->id_m
            ]);
        }

        $demande->date_mag = now();
        $demande->id_mag = $user ? $user->id_utilisateur : null;
        $demande->date_rec = $request->materiels[0]['date_rec']; // ou autre logique
        $demande->etat = $request->validation_finale ? 'valide' : 'en_affectation';
        $demande->save();

        return response()->json([
            'success' => true,
            'message' => $request->validation_finale ? 'Demande validée avec succès.' : 'Matériels affectés (en cours d\'affectation).',
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

    public function historiqueMateriels($id_demande)
    {
        $historique = \App\Models\Historique::where('historique.id_demande', $id_demande)
            ->join('materiel', 'historique.id_m', '=', 'materiel.id_m')
            ->leftJoin('immobilisable', function($join) {
                $join->on('historique.id_m', '=', 'immobilisable.id_m')
                     ->where('materiel.type_materiel', '=', 'immobilisable');
            })
            ->leftJoin('mobilisable', function($join) {
                $join->on('historique.id_m', '=', 'mobilisable.id_m')
                     ->where('materiel.type_materiel', '=', 'mobilisable');
            })
            ->select(
                'historique.*',
                'materiel.designation',
                'materiel.type_materiel',
                'materiel.etat',
                'immobilisable.matricule',
                'mobilisable.code_M'
            )
            ->get();

        return response()->json(['materiels' => $historique]);
    }

    public function historiqueGlobal()
    {
        $historique = \App\Models\Historique::join('materiel', 'historique.id_m', '=', 'materiel.id_m')
            ->leftJoin('immobilisable', function($join) {
                $join->on('historique.id_m', '=', 'immobilisable.id_m')
                     ->where('materiel.type_materiel', '=', 'immobilisable');
            })
            ->leftJoin('mobilisable', function($join) {
                $join->on('historique.id_m', '=', 'mobilisable.id_m')
                     ->where('materiel.type_materiel', '=', 'mobilisable');
            })
            ->join('demande', 'historique.id_demande', '=', 'demande.id_demande')
            ->select(
                'historique.*',
                'materiel.designation',
                'materiel.type_materiel',
                'materiel.etat',
                'immobilisable.matricule',
                'mobilisable.code_M',
                'demande.categorie',
                'demande.id_collaborateur',
                'demande.date_demande',
                'demande.etat as etat_demande'
            )
            ->orderBy('historique.created_at', 'desc')
            ->get();

        return response()->json(['historique' => $historique]);
    }
} 