<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Faction;
use Illuminate\Support\Str;

class FactionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $factions = [
            ['name' => 'Survivors'],
            ['name' => 'Scientists'],
        ];

        foreach($factions as $faction) {
            Faction::create($faction);
        }
    }
}
