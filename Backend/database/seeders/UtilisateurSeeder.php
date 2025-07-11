<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('utilisateur')->insert([
            [
                'id_utilisateur' => 'U0001',
                'nom' => 'Saoud',
                'prenom' => 'Amina',
                'email' => 'amina@example.com',
                'mdp' => Hash::make('password123'),
                'tel' => '0612345678',
                'service' => 'Informatique',
                'fonction' => 'Développeuse',
                'role' => 'collaborateur',
                'id_admin' => 'A0001',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_utilisateur' => 'U0002',
                'nom' => 'Yassine',
                'prenom' => 'Ali',
                'email' => 'yassine@example.com',
                'mdp' => Hash::make('azerty'),
                'tel' => '0600000000',
                'service' => 'Technique',
                'fonction' => 'Contrôleur',
                'role' => 'controleur technique',
                'id_admin' => 'A0001',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
