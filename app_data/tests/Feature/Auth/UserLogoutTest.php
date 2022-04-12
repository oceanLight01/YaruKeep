<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserLogoutTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'screen_name' => 'testname',
            'email' => 'example@example.com'
        ]);

        $this->actingAs($this->user);
    }

    /**
     * ログアウトが正常に完了する
     */
    public function test_logout_success()
    {
        $this->assertAuthenticatedAs($this->user);

        $this->json('POST', '/api/logout')
        ->assertStatus(204);

        $this->assertGuest();
    }
}
