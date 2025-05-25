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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname')->nullable();
            $table->string('name');
            $table->string('lastname')->nullable();
            $table->string('email')->unique();
            $table->string('verification_code')->unique();
            $table->string('phone')->unique();
            $table->string('position')->nullable();
            $table->json('address')->nullable();
            $table->string('gender')->nullable();
            $table->string('google_refresh_token')->nullable();
            $table->string('google_calendar')->nullable();
            $table->string('microsoft_todo')->nullable();
            $table->string('google_drive')->nullable();
            $table->string('microsoft_calendar')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
