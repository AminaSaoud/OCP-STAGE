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
       Schema::create('admin', function (Blueprint $table) {
            $table->string('id_admin', 10)->primary();
            $table->string('nom', 191);
            $table->string('prenom', 191);
            $table->string('email', 191)->unique();
            $table->string('mdp', 191);
            $table->string('tel', 16);
            $table->string('role', 50);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
};
