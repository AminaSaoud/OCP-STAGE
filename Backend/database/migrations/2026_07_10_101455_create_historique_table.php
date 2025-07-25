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
        Schema::create('historique', function (Blueprint $table) {
            $table->string('id_historique', 20)->primary();
            $table->string('id_demande', 10);
            $table->string('id_m', 10);
            $table->timestamps();

            // Clé étrangère vers materiel
            $table->foreign('id_m')
                ->references('id_m')
                ->on('materiel')
                ->onDelete('cascade');

            // Clé étrangère vers demande
            $table->foreign('id_demande')
                ->references('id_demande')
                ->on('demande')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique');
    }
}; 