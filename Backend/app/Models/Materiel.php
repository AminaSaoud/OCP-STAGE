<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materiel extends Model
{
    protected $table = 'materiel';
    protected $primaryKey = 'id_m';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id_m', 'type_materiel', 'designation', 'emplacement', 'etat', 'date_E', 'date_S'];

    public function mobilisable()
    {
        return $this->hasOne(Mobilisable::class, 'id_m');
    }

    public function immobilisable()
    {
        return $this->hasOne(Immobilisable::class, 'id_m');
    }

    public function operations()
    {
        return $this->hasMany(Operation::class, 'id_m');
    }

    public function historiques()
    {
        return $this->hasMany(Historique::class, 'id_m');
    }
}
