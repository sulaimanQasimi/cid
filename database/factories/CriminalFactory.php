<?php

namespace Database\Factories;

use App\Models\Criminal;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Criminal>
 */
class CriminalFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Criminal::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'photo' => null,
            'number' => $this->faker->unique()->regexify('CR[0-9]{4}'),
            'name' => $this->faker->name(),
            'father_name' => $this->faker->name(),
            'grandfather_name' => $this->faker->name(),
            'id_card_number' => $this->faker->unique()->numerify('##########'),
            'phone_number' => $this->faker->phoneNumber(),
            'original_residence' => $this->faker->address(),
            'current_residence' => $this->faker->address(),
            'crime_type' => $this->faker->randomElement(['Theft', 'Fraud', 'Assault', 'Drug Offense', 'Robbery']),
            'arrest_location' => $this->faker->city(),
            'arrested_by' => $this->faker->name(),
            'arrest_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'referred_to' => $this->faker->randomElement(['Court', 'Prosecutor', 'Police Station']),
            'final_verdict' => $this->faker->randomElement(['Guilty', 'Not Guilty', 'Pending']),
            'notes' => $this->faker->paragraph(),
            'department_id' => Department::factory(),
            'created_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the criminal has no department.
     */
    public function withoutDepartment(): static
    {
        return $this->state(fn (array $attributes) => [
            'department_id' => null,
        ]);
    }

    /**
     * Indicate that the criminal has a photo.
     */
    public function withPhoto(): static
    {
        return $this->state(fn (array $attributes) => [
            'photo' => 'photos/' . $this->faker->uuid() . '.jpg',
        ]);
    }
}
