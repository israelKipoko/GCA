<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->name(),
            'due_date' => date('Y-m-d'),
            'note' => fake()->sentence(),
            'type' => "for_me",
            'created_by' => fake()->numberBetween(1, 7),
            'assigned_to' =>[
                "1" => fake()->numberBetween(1, 10),
                "2" => fake()->numberBetween(1, 10),
                "3" => fake()->numberBetween(1, 10),
            ]
        ];
    }
}
