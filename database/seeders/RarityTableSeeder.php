<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rarity;

class RarityTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $rarities = [
            ['class' => 'E','name' => 'Common'],
            ['class' => 'D','name' => 'Uncommon'],
            ['class' => 'C','name' => 'Unique'],
            ['class' => 'B','name' => 'Rare'],
            ['class' => 'A','name' => 'Epic'],
            ['class' => 'S','name' => 'Legendary'],
            ['class' => 'S+','name' => 'Mythical'],
        ];

        foreach($rarities as $rarity) {
            Rarity::create($rarity);
        }
        
    }
}
