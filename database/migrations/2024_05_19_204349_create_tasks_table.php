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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->date("due_date")->nullable();
            $table->longText("note")->nullable();
            $table->string("status")->default("pending");
            $table->unsignedBigInteger('created_by');
            $table->foreign("created_by")->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('case_id')->nullable();
            $table->string('task')->nullable();
            $table->foreign("case_id")->references('id')->on('cases')->onDelete('cascade');
            $table->json('assigned_to')->nullable();
            $table->json('assigned_group')->nullable();
            $table->json('category')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
