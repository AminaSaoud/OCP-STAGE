<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    protected $table = 'demande';
    protected $primaryKey = 'id_demande';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_demande', 'date_demande', 'categorie', 'designation', 'description',
        'justification', 'quantite', 'type', 'etat', 'date_tech', 'date_mag', 'date_rec',
         'id_collaborateur', 'id_tech', 'id_mag'
    ];

    // Ajout des casts pour une meilleure gestion des types
    protected $casts = [
        'date_demande' => 'datetime',
        'date_tech' => 'datetime',
        'date_mag' => 'datetime',
        'date_rec' => 'datetime',
        'disponible' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relations (vos relations existantes sont parfaites)
    public function collaborateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_collaborateur', 'id_utilisateur');
    }

    public function controleurTechnique()
    {
        return $this->belongsTo(Utilisateur::class, 'id_tech', 'id_utilisateur');
    }

    public function controleurMagasin()
    {
        return $this->belongsTo(Utilisateur::class, 'id_mag', 'id_utilisateur');
    }

    public function historiques()
    {
        return $this->hasMany(Historique::class, 'id_demande');
    }

    public function materiel()
    {
        return $this->belongsTo(Materiel::class, 'materiel_id', 'id_m');
    }

    // Méthodes utilitaires ajoutées
    public function getEtatLabelAttribute()
    {
        $etats = [
            'en_attente' => 'En attente',
            'refuse' => 'Refusé',
            'valide_technique' => 'Validé techniquement',
            'valide' => 'Validé',
            'materiel_indispo' => 'Matériel indisponible'
        ];

        return $etats[$this->etat] ?? $this->etat;
    }

    public function getCategorieOptions()
    {
        return [
            'chantier' => 'Chantier',
            'informatique' => 'Informatique',
            'climatisation' => 'Climatisation',
            'électroménager' => 'Électroménager',
            'mobilier' => 'Mobilier',
            'logistique' => 'Logistique',
            'sécurité' => 'Sécurité',
            'technique' => 'Technique',
            'autre' => 'Autre'
        ];
    }

    // Scopes utiles pour filtrer les demandes
    public function scopeEnAttente($query)
    {
        return $query->where('etat', 'en_attente');
    }

    public function scopeValide($query)
    {
        return $query->where('etat', 'valide');
    }

    public function scopeParCollaborateur($query, $id_collaborateur)
    {
        return $query->where('id_collaborateur', $id_collaborateur);
    }

    public function scopeParCategorie($query, $categorie)
    {
        return $query->where('categorie', $categorie);
    }
}