<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCratesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('crates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('crate_id');

            $table->string('name')->unique();

            $table->unsignedBigInteger('faction_id')->nullable();
            $table->foreign('faction_id')->references('id')->on('factions')->onDelete('set null');

            $table->unsignedTinyInteger('level')->default(1);            
            $table->unsignedTinyInteger('quantity')->default(4);
            $table->double('price', 8, 3)->default(0.000);

            $table->string('v360')->nullable();

            $table->boolean('is_deleted')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('crates');
    }
}
