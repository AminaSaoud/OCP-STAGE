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
        'justification', 'etat', 'date_tech', 'date_mag', 'date_rec',
        'disponible', 'id_collaborateur', 'id_tech', 'id_mag'
    ];

    public function collaborateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_collaborateur');
    }

    public function controleurTechnique()
    {
        return $this->belongsTo(Utilisateur::class, 'id_tech');
    }

    public function controleurMagasin()
    {
        return $this->belongsTo(Utilisateur::class, 'id_mag');
    }

    public function historiques()
    {
        return $this->hasMany(Historique::class, 'id_demande');
    }
}
