<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BadgeType;
use Illuminate\Support\Str;

class BadgeTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $badgeTypes = [
            ['name' => 'BRONZE'],
            ['name' => 'SILVER'],
            ['name' => 'GOLD'],
            ['name' => 'DIAMOND'],
            ['name' => 'BLACK_DIAMOND'],
        ];

        foreach($badgeTypes as $badgeType) {
            BadgeType::create($badgeType);
        }
    }
}
