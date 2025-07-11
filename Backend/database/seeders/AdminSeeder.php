<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run()
    {
        DB::table('admin')->insert([
            'id_admin' => 'A0001',
            'nom' => 'Admin',
            'prenom' => 'Principal',
            'email' => 'admin@example.com',
            'mdp' => bcrypt('password'),
            'tel' => '0600000000',
            'role' => 'superadmin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
