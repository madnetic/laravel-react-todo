<?php

use Illuminate\Database\Seeder;

class TasklistsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Tasklist::class, 5)
            ->create()
            ->each(function($tl) {
                $tl->tasks()->saveMany(
                    factory(App\Task::class, rand(3, 7))->make()    
                );
            });
    }
}
