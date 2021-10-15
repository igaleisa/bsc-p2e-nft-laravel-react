<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\UserTableSeeder;
use Database\Seeders\FactionTableSeeder;
use Database\Seeders\RarityTableSeeder;
use Database\Seeders\CategoryTableSeeder;
use Database\Seeders\CrateTableSeeder;
use Database\Seeders\CrateRarityTableSeeder;
use Database\Seeders\BadgeTypeTableSeeder;
use Database\Seeders\TokenStateTableSeeder;
use Database\Seeders\TokenTypeTableSeeder;
use Database\Seeders\ZoneTypeTableSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserTableSeeder::class,
            FactionTableSeeder::class,
            RarityTableSeeder::class,
            CategoryTableSeeder::class,
            BadgeTypeTableSeeder::class,
            TokenStateTableSeeder::class,
            TokenTypeTableSeeder::class,
            ZoneTypeTableSeeder::class,
            // CrateTableSeeder::class,
            // CrateRarityTableSeeder::class,
        ]);


        \App\Models\User::factory(10)->create();
        // \App\Models\Equipment::factory(100)->create();
    }
}
