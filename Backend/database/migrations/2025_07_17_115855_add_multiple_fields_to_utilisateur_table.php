<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('utilisateur', function (Blueprint $table) {
            // Champ pour forcer le changement de mot de passe
            $table->boolean('must_change_password')->default(true);
            
            // Champ matricule
            $table->string('matricule', 16)->nullable();
            
            // Champ actif (pour résoudre l'erreur précédente)
            $table->boolean('actif')->default(true);
            
            // Champs personnels et professionnels
            $table->date('date_naissance')->nullable()->after('tel');
            $table->string('cin', 20)->nullable()->after('date_naissance');
            $table->date('date_prise_fonction')->nullable()->after('cin');
            
            // Vous pouvez ajouter d'autres champs ici si nécessaire
            // $table->timestamp('last_login')->nullable();
            // $table->string('phone', 20)->nullable();
            // $table->text('bio')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('utilisateur', function (Blueprint $table) {
            $table->dropColumn([
                'must_change_password',
                'matricule',
                'actif',
                'date_naissance',
                'cin',
                'date_prise_fonction'
            ]);
        });
    }
};