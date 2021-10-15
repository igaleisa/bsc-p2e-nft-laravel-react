<?php

namespace Database\Factories;

use App\Models\Equipment;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EquipmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Equipment::class;
    protected $count = 1;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $rarities = [5, 6, 7];

        return [
            'tokenId' => $this->count++,
            'category_id' => mt_rand(1, Category::all()->count()),
            'rarity_id' => $rarities[array_rand($rarities)],
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'image' => Str::random(24) . '.png',
        ];
    }
}
