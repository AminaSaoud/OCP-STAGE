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
        Schema::create('materiel', function (Blueprint $table) {
            $table->string('id_m', 10)->primary();

            $table->enum('type_materiel', ['mobilisable', 'immobilisable']);
            $table->string('designation', 191);
            $table->text('description');
            $table->string('emplacement', 191);

            $table->timestamp('date_E')->useCurrent();
            $table->timestamp('date_S')->nullable();

            $table->enum('etat', ['disponible', 'indisponible'])->default('disponible');

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materiel');
    }
};
