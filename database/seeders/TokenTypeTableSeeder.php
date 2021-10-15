<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TokenType;
use Illuminate\Support\Str;

class TokenTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tokenTypes = [
            ['name' => 'Character'],
            ['name' => 'Object'],
            ['name' => 'Badge'],
            ['name' => 'Zone'],
        ];

        foreach($tokenTypes as $tokenType) {
            TokenType::create($tokenType);
        }
    }
}
