<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mobilisable extends Model
{
    protected $table = 'mobilisable';
    protected $primaryKey = 'id_m';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id_m', 'code_M', 'quantite'];

    public function materiel()
    {
        return $this->belongsTo(Materiel::class, 'id_m');
    }
}
