<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cases>
 */
class CasesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        fake()->locale('fr_FR'); 
        return [
            'number' => fake()->numberBetween(1000, 9999),
            'title' => fake()->sentence(),
            'description' => fake()->text(),
            'type' => "conseil juridique",
            'assigned_to' => [1,2,],
            'client_id' => 1,
            'created_by' => 1,
            'due_date' => now(),
        ];
    }
}
