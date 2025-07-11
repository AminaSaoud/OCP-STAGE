<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Operation extends Model
{
    protected $table = 'operation';
    protected $primaryKey = 'id_operation';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id_operation', 'id_m', 'id_mag', 'type_O'];

    public function materiel()
    {
        return $this->belongsTo(Materiel::class, 'id_m');
    }

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_mag');
    }
}

