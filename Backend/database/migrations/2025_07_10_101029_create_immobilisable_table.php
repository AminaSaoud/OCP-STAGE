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
        Schema::create('immobilisable', function (Blueprint $table) {
            $table->string('id_m', 10)->primary();
            $table->string('matricule', 16);
            $table->string('numero_S', 16);
            $table->integer('duree_Amort');
            $table->enum('status', ['neuf', 'repare'])->default('neuf');
            $table->string('rppt_maint', 255)->nullable();
            $table->timestamps();

            $table->foreign('id_m')
                ->references('id_m')
                ->on('materiel')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('immobilisable');
    }
};