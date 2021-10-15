<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrateRaritiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('crate_rarities', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('crate_id');
            $table->foreign('crate_id')->references('id')->on('crates')->onDelete('cascade');

            $table->unsignedBigInteger('rarity_id');
            $table->foreign('rarity_id')->references('id')->on('rarities')->onDelete('cascade');

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
        Schema::dropIfExists('crate_rarities');
    }
}
