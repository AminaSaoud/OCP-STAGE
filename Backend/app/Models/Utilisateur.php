<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    
    use HasApiTokens, Notifiable;

    protected $table = 'utilisateur';
    protected $primaryKey = 'id_utilisateur';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id_utilisateur', 'nom', 'prenom', 'email', 'mdp', 'tel', 'service', 'fonction', 'role', 'id_admin'];

    protected $hidden = ['mdp'];

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'id_admin');
    }

    public function demandesCollaborateur()
    {
        return $this->hasMany(Demande::class, 'id_collaborateur');
    }

    public function demandesTech()
    {
        return $this->hasMany(Demande::class, 'id_tech');
    }

    public function demandesMag()
    {
        return $this->hasMany(Demande::class, 'id_mag');
    }

    public function operations()
    {
        return $this->hasMany(Operation::class, 'id_mag');
    }

    public function getAuthPassword()
    {
        return $this->mdp;
    }
}
