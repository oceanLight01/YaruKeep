<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class EmailChangeTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'email' => 'example@example.com'
        ]);
        $this->user2 = User::factory()->create([
            'email' => 'example2@example.com'
        ]);

        $this->actingAs($this->user);
    }

    /**
     * メールアドレスの変更に成功する
     */
    public function test_change_email()
    {
        $this->json('POST', '/api/email/change', [
            'user_id' => 1,
            'email' => 'newmail@example.com'
        ])
            ->assertStatus(200);

        $token = DB::table('email_resets')->where('user_id', 1)->value('token');

        $this->json('GET', '/api/email/change/'.$token)
            ->assertStatus(302)
            ->assertRedirect('/settings');
    }

    /**
     * 新しいメールアドレスが重複して変更に失敗する
     */
    public function test_fail_change_email_dupulicate()
    {
        $this->json('POST', '/api/email/change', [
            'user_id' => 1,
            'email' => 'example2@example.com'
        ])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'email' => ['このメールアドレスはすでに登録されています。'],
                ]
            ]);

    }
}
