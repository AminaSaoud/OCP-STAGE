<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Immobilisable extends Model
{
    protected $table = 'immobilisable';
    protected $primaryKey = 'id_m';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id_m', 'matricule', 'numero_S', 'duree_Amort', 'status', 'rppt'];

    public function materiel()
    {
        return $this->belongsTo(Materiel::class, 'id_m');
    }
}
