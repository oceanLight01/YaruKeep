<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->actingAs($this->user);

        $this->notification = Notification::factory()->create();
    }

    /**
     * 通知一覧の取得に成功する
     */
    public function test_fetch_all_notification()
    {
        $this->json('GET', '/api/notifications')
            ->assertStatus(200)
            ->assertJsonStructure([
                'unread_notification',
                'notification',
                'next_cursor',
                'has_next',
                'notification_count'
            ]);
    }

    /**
     * 未読通知の取得に成功する
     */
    public function test_fetch_unread_notification()
    {
        $this->json('GET', '/api/notifications/unread')
        ->assertStatus(200)
        ->assertJsonStructure([
            'unread_notification',
            'unread_notification_count',
        ]);
    }

    /**
     * 一件の通知の既読処理に成功する
     */
    public function test_read_one_notification()
    {
        $this->json('PUT', '/api/notifications', [
            'id' => 1,
        ])
        ->assertStatus(200)
        ->assertJsonStructure([
            'unread_notification',
            'unread_notification_count',
        ]);
    }

    /**
     * 通知の全件既読処理に成功する
     */
    public function test_read_all_notification()
    {
        $this->json('PUT', '/api/notifications/read')
        ->assertStatus(200)
        ->assertJsonStructure([
            'unread_notification',
            'unread_notification_count',
        ]);
    }
}
