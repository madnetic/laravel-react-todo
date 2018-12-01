<?php

namespace Tests\Feature;

use App\Tasklist;
use App\User;
use Tests\TestCase;

class TasklistControllerTest extends TestCase
{
    public function testIndex()
    {
        $this
            ->actingAs(User::find(1), 'api')
            ->get('/api/tasklists')
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    [
                        'id',
                        'name',
                        'user_id',
                        'created_at',
                        'updated_at',
                        'tasks' => [
                            ['title', 'done', 'expires_at']
                        ]
                    ]
                ],
                'meta' => ['current_page', 'from', 'last_page', 'per_page', 'to', 'total']
            ]);
    }

    public function testStore() {
        $this
            ->actingAs(User::find(1), 'api')
            ->json('POST', '/api/tasklists', ['name' => 'Dummy list'])
            ->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Dummy list',
                'user_id' => 1
            ]);
    }

    public function testShow() {
        $this
            ->actingAs(User::find(1), 'api')
            ->get('/api/tasklists?page=1&perPage=3')
            ->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonCount(4, 'data.0.tasks')
            ->assertJsonFragment([
                'meta' => [
                    'current_page' => 1,
                    'from' => 1,
                    'last_page' => 3,
                    'per_page' => 3,
                    'to' => 3,
                    'total' => 9
                ]
            ])
            ->assertJsonStructure([
                'data' => [
                    [
                        'id',
                        'name',
                        'user_id',
                        'updated_at',
                        'created_at',
                        'tasks' => [
                            ['title', 'done', 'expires_at']
                        ]
                    ]
                ]
            ]);
    }

    public function testDestroy() {
        $tasklistId = Tasklist::orderByDesc('id')->first()->id;
        $this
            ->actingAs(User::find(1), 'api')
            ->delete("/api/tasklists/$tasklistId")
            ->assertStatus(200);
    }
}
