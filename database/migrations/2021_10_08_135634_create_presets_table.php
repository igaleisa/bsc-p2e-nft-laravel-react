<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePresetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('presets', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('preset_id')->unique();

            $table->unsignedBigInteger('tokentype_id')->nullable();
            $table->foreign('tokentype_id')->references('id')->on('token_types')->onDelete('set null');

            $table->unsignedTinyInteger('level')->nullable();

            $table->unsignedBigInteger('faction_id')->nullable();;
            $table->foreign('faction_id')->references('id')->on('factions')->onDelete('set null');

            $table->unsignedBigInteger('category_id')->nullable();;
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');

            $table->unsignedBigInteger('rarity_id')->nullable();
            $table->foreign('rarity_id')->references('id')->on('rarities')->onDelete('set null');

            $table->unsignedBigInteger('badgetype_id')->nullable();
            $table->foreign('badgetype_id')->references('id')->on('badge_types')->onDelete('set null');

            $table->unsignedBigInteger('zonetype_id')->nullable();
            $table->foreign('zonetype_id')->references('id')->on('zone_types')->onDelete('set null');

            $table->double('price', 8, 3)->default(0.000);

            $table->boolean('is_deleted')->default(false);
            
            $table->string('name');
            $table->text('description');
            $table->string('thumbnail');
            $table->json('attributes')->nullable();           
            $table->string('v360')->nullable();

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
        Schema::dropIfExists('presets');
    }
}
