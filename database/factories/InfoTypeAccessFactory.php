<?php

namespace Database\Factories;

use App\Models\InfoTypeAccess;
use App\Models\InfoType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InfoTypeAccess>
 */
class InfoTypeAccessFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = InfoTypeAccess::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'info_type_id' => InfoType::factory(),
            'user_id' => User::factory(),
        ];
    }
}