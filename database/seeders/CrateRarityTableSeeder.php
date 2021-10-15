<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Crate;
use App\Models\Rarity;
use App\Models\CrateRarity;

class CrateRarityTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $basic_biocrate = Crate::where('name', 'Basic Biocrate')->firstOrFail();
        $tactical_biocrate = Crate::where('name', 'Tactical Biocrate')->firstOrFail();
        $alpha_type = Crate::where('name', 'Alpha Type')->firstOrFail();
        $omega_type = Crate::where('name', 'Omega Type')->firstOrFail();

        $common = Rarity::where('name', 'Common')->firstOrFail();
        $uncommon = Rarity::where('name', 'Uncommon')->firstOrFail();
        $unique = Rarity::where('name', 'Unique')->firstOrFail();

        $crate_rarities = [
            [
                'crate_id' => $basic_biocrate->id,
                'rarity_id' => $common->id
            ],
            [
                'crate_id' => $basic_biocrate->id,
                'rarity_id' => $uncommon->id
            ],
            [
                'crate_id' => $tactical_biocrate->id,
                'rarity_id' => $unique->id
            ],
            [
                'crate_id' => $alpha_type->id,
                'rarity_id' => $common->id
            ],
            [
                'crate_id' => $alpha_type->id,
                'rarity_id' => $uncommon->id
            ],
            [
                'crate_id' => $omega_type->id,
                'rarity_id' => $unique->id
            ],
        ];

        foreach($crate_rarities as $crate_rarity) {
            CrateRarity::create($crate_rarity);
        }
    }
}
