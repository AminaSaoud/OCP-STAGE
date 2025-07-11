<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;



class Admin extends Authenticatable
{

    use HasApiTokens, Notifiable; // ⬅️ Important pour createToken()

    protected $table = 'admin';
    protected $primaryKey = 'id_admin';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id_admin', 'nom', 'prenom', 'email', 'mdp', 'tel', 'role'];

    protected $hidden = ['mdp'];

    public function utilisateurs()
    {
        return $this->hasMany(Utilisateur::class, 'id_admin');
    }

    public function getAuthPassword()
    {
        return $this->mdp;
    }
}
