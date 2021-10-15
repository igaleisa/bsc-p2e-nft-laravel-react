<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrateTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('crate_tokens', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('crate_id');
            $table->foreign('crate_id')->references('id')->on('crates')->onDelete('cascade');

            $table->unsignedBigInteger('token_id');
            $table->foreign('token_id')->references('id')->on('tokens')->onDelete('cascade');

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
        Schema::dropIfExists('crate_tokens');
    }
}
