<?php

use Faker\Generator as Faker;
use App\Task;

$factory->define(Task::class, function (Faker $faker) {
    return [
        'title' => substr($faker->sentence(5), 0, -1),
        'notes' => rand(0, 1) ? substr($faker->sentence(5), 0, -1) : null,
        'expires_at' => (new \DateTime())->add(new \DateInterval('P'.rand(0, 7).'D')),
        'priority' => array_random(['low', 'medium', 'high']),
        'done' => (bool)rand(0, 1)
    ];
});
