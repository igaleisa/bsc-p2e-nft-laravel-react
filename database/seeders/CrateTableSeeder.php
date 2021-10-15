<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Crate;
use App\Models\Faction;
use App\Models\Rarity;

class CrateTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $Surviors = Faction::where('name', 'Survivors')->firstOrFail();
        $Scientists = Faction::where('name', 'Scientists')->firstOrFail();

        $crates = [
            [
                'faction_id' => $Surviors->id,
                'level' => 1,
                'name' => 'Basic Biocrate',
                'price' => 29.99,
            ],
            [
                'faction_id' => $Surviors->id,
                'level' => 2,
                'name' => 'Tactical Biocrate',
                'price' => 89.99,
            ],
            [
                'faction_id' => $Scientists->id,
                'level' => 1,
                'name' => 'Alpha Type',
                'price' => 29.99,
            ],
            [
                'faction_id' => $Scientists->id,
                'level' => 2,
                'name' => 'Omega Type',
                'price' => 89.99,
            ],
        ];

        foreach($crates as $crate) {
            Crate::create($crate);
        }
        
    }
}
