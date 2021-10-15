<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TokenState;
use Illuminate\Support\Str;

class TokenStateTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tokenStates = [
            ['name' => 'ADMIN_OWNED'],
            ['name' => 'USER_OWNED'],
            ['name' => 'USER_EQUIPPED'],
            ['name' => 'USER_STAKED'],
            ['name' => 'BURNED'],
        ];

        foreach($tokenStates as $tokenState) {
            TokenState::create($tokenState);
        }
    }
}
