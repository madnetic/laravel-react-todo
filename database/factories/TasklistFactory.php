<?php

use Faker\Factory as Faker;
use App\Tasklist;
use App\Faker\Provider\EnumProvider;

$faker = Faker::create();
$faker->addProvider(new EnumProvider($faker, ['home', 'work', 'workout', 'life', 'entertainment']));

$factory->define(Tasklist::class, function () use ($faker) {
    return [
        'name' => $faker->uniqueEnum(),
        'user_id' => 1
    ];
});
