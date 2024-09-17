<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Clients>
 */
class ClientsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'type' => fake()->company(),
            'pictures' => "images/profiles/man_default_profile.jpeg",
            'location' => [
                "country" => "RDC",
                "city" => "kinshasa",
                "postalCode" => "11011",
            ],
        ];
    }
}
