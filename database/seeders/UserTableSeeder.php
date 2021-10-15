<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if(config('admin.admin_name')) {
            User::firstOrCreate(
                ['email' => config('admin.admin_email')],
                [
                    'username' => config('admin.admin_name'),
                    'password' => bcrypt(config('admin.admin_password')),
                    'role' => config('admin.admin_role'),
                    'email_verified_at' => now(),
                    'remember_token' => Str::random(10),
                    'referral_code' => Str::uuid(),
                ]
            );
        }
    }
}
