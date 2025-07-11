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
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            // Supprimer la contrainte de clé étrangère si elle existe
            $table->dropIndex(['tokenable_type', 'tokenable_id']);
            
            // Modifier le type de tokenable_id pour accepter les strings
            $table->string('tokenable_id', 50)->change();
            
            // Recréer l'index
            $table->index(['tokenable_type', 'tokenable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropIndex(['tokenable_type', 'tokenable_id']);
            $table->unsignedBigInteger('tokenable_id')->change();
            $table->index(['tokenable_type', 'tokenable_id']);
        });
    }
};