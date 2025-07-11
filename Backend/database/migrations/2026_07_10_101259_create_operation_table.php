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
        Schema::create('operation', function (Blueprint $table) {
            $table->string('id_operation', 10)->primary();

            $table->string('id_m', 10);
            $table->string('id_mag', 10);
            $table->string('type_O', 255);

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            // Foreign key vers materiel
            $table->foreign('id_m')
                ->references('id_m')
                ->on('materiel')
                ->onDelete('cascade');

            // Foreign key vers utilisateur
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
        Schema::dropIfExists('operation');
    }
};
