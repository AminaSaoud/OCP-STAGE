<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historique extends Model
{
    protected $table = 'historique';
    protected $primaryKey = 'id_historique';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id_historique', 'id_m', 'id_demande'];

    public function materiel()
    {
        return $this->belongsTo(Materiel::class, 'id_m');
    }

    public function demande()
    {
        return $this->belongsTo(Demande::class, 'id_demande');
    }
}
