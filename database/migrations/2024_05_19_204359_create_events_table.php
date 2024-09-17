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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->date("date");
            $table->json("time");
            $table->longText("note")->nullable();
            $table->longText("reminder")->nullable();
            $table->longText("meeting_link")->nullable();
            $table->unsignedBigInteger('case_id')->nullable();
            $table->foreign("case_id")->references('id')->on('cases')->onDelete('cascade');
            $table->unsignedBigInteger('created_by');
            $table->foreign("created_by")->references('id')->on('users')->onDelete('cascade');
            $table->json('participants')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
