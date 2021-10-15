<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ZoneType;
use Illuminate\Support\Str;

class ZoneTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $zoneTypes = [
            ['name' => 'S1'],
            ['name' => 'S1b'],
            ['name' => 'S2'],
            ['name' => 'S2b'],
            ['name' => 'S3'],
            ['name' => 'S4'],
            ['name' => 'S5'],
            ['name' => 'S6'],
        ];

        foreach($zoneTypes as $zoneType) {
            ZoneType::create($zoneType);
        }
    }
}
