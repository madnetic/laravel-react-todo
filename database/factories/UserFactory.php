<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\User::class, function (Faker $faker) {
    return [
        'email' => 'demo@demo.com',
        'email_verified_at' => now(),
        'password' => '$2y$10$tY5E/qZBST2PhgoMEjusceiG/CWK/I.cRTmtIGaJldQSNPQ7kAcoi', // demo1234
        'remember_token' => str_random(10),
        'api_token' => str_random(60)
    ];
});
