<?php

namespace Database\Factories;

use App\Models\CriminalAccess;
use App\Models\Criminal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CriminalAccess>
 */
class CriminalAccessFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CriminalAccess::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'criminal_id' => Criminal::factory(),
            'user_id' => User::factory(),
        ];
    }
}
