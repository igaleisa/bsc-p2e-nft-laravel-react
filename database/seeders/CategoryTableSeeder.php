<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['faction_id' => 1,'name' => 'Weapons'],
            ['faction_id' => 1,'name' => 'Armor'],
            ['faction_id' => 1,'name' => 'Accesories'],
            ['faction_id' => 2,'name' => 'Viruses and Bacteria'],
            ['faction_id' => 2,'name' => 'Parasites and Fungus'],
            ['faction_id' => 2,'name' => 'Virus Variants'],
        ];

        foreach($categories as $category) {
            Category::create($category);
        }
    }
}
