<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tokens', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('token_id')->unique();

            $table->unsignedBigInteger('preset_id');
            $table->foreign('preset_id')->references('id')->on('presets')->onDelete('cascade');

            $table->string('owner');

            $table->unsignedBigInteger('state_id');
            $table->foreign('state_id')->references('id')->on('token_states')->onDelete('cascade');

            $table->unsignedTinyInteger('health')->default(100);

            $table->double('price', 8, 3)->default(1.000);

            $table->boolean('is_sale')->default(false);

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
        Schema::dropIfExists('tokens');
    }
}
