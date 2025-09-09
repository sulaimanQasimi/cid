<?php

namespace Database\Factories;

use App\Models\Visitor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Visitor>
 */
class VisitorFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Visitor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'region' => $this->faker->state(),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'user_id' => User::factory(),
            'session_id' => $this->faker->uuid(),
            'url' => $this->faker->url(),
            'referrer' => $this->faker->optional()->url(),
            'method' => $this->faker->randomElement(['GET', 'POST', 'PUT', 'DELETE']),
            'visitable_type' => 'App\\Models\\Criminal',
            'visitable_id' => 1,
            'visited_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'duration_seconds' => $this->faker->numberBetween(1, 3600),
            'device_type' => $this->faker->randomElement(['mobile', 'desktop', 'tablet']),
            'browser' => $this->faker->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
            'browser_version' => $this->faker->numerify('#.#.#'),
            'platform' => $this->faker->randomElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
            'platform_version' => $this->faker->numerify('#.#'),
            'is_bounce' => $this->faker->boolean(30),
            'metadata' => $this->faker->optional()->randomElements(['key1' => 'value1', 'key2' => 'value2']),
        ];
    }
}
