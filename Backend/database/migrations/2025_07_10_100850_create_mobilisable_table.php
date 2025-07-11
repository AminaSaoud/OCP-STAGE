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
        Schema::create('mobilisable', function (Blueprint $table) {
            $table->string('id_m', 10)->primary();
            $table->string('code_M', 16);
            $table->integer('quantite');

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

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
        Schema::dropIfExists('mobilisable');
    }
};
