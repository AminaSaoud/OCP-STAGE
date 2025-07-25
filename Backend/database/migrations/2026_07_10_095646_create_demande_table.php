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
        Schema::create('demande', function (Blueprint $table) {
            $table->string('id_demande', 10)->primary();
            $table->timestamp('date_demande')->useCurrent();
            $table->enum('categorie', [
                'chantier', 'informatique', 'climatisation', 'électroménager',
                'mobilier', 'logistique', 'sécurité', 'technique', 'autre'
            ]);
            $table->string('designation', 191);
            $table->text('description');
            $table->string('justification', 255);
            $table->enum('etat', [
                'en_attente', 'refuse', 'valide_technique', 'valide', 'materiel_indispo'
            ])->default('en_attente');
            $table->timestamp('date_tech')->nullable();
            $table->timestamp('date_mag')->nullable();
            $table->timestamp('date_rec')->nullable();
            $table->text('motif_refus')->nullable();
            $table->integer('quantite')->default(1);
            $table->enum('type', ['mobilisable', 'immobilisable']);

            $table->string('id_collaborateur', 10);
            $table->string('id_tech', 10)->nullable();
            $table->string('id_mag', 10)->nullable();

            $table->timestamps(); 

            // Foreign keys
            $table->foreign('id_collaborateur')
                  ->references('id_utilisateur')
                  ->on('utilisateur')
                  ->onDelete('cascade');

            $table->foreign('id_tech')
                  ->references('id_utilisateur')
                  ->on('utilisateur')
                  ->onDelete('cascade');

            $table->foreign('id_mag')
                  ->references('id_utilisateur')
                  ->on('utilisateur')
                  ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demande');
    }
};
