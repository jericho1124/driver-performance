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
        Schema::create('driver_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_id');
            $table->date('date');
            $table->integer('delays_minutes')->default(0);
            $table->integer('behavioral_problems')->default(0);
            $table->integer('violations_count')->default(0);
            $table->integer('accidents_count')->default(0);
            $table->decimal('rating', 3, 2);
            $table->timestamps();

            $table->index('driver_id');
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_profiles');
    }
};
