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
        Schema::create('pending_cases', function (Blueprint $table) {
            $table->id();
            $table->foreign('user_id');
            $table->foreign('user_id')->references('id')->on('user')->onDelete('cascade');
            $table->longText('comments')->nullable();
            $table->json('assigned_group')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pending_cases');
    }
};
