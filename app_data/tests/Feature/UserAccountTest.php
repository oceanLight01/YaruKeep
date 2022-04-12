<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserAccountTest extends TestCase
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
     * アカウントプロフィールの変更が正常に完了する。
     */
    public function test_edit_profile()
    {
        $this->json('PUT','/api/user/profile-information',[
            'name' => 'name',
            'screen_name' => 'screenName',
            'profile' => 'test'
        ])
            ->assertStatus(200);
    }

    /**
     * バリデーションに引っかかる際にエラーメッセージを返す。
     */
    public function test_faild_edit_profile()
    {
        $this->json('PUT','/api/user/profile-information',[
            'name' => '',
            'screen_name' => 'screenName',
            'profile' => 'test'
        ])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'name' => ['ユーザ名の項目は必須です。'],
                ]
            ]);
    }

    /**
     * メールアドレスの変更が正常に完了する。
     */
    public function test_change_email()
    {
        $this->json('POST', '/api/email/change', [
            'user_id' => $this->user->id,
            'email' => 'example3@example.com'
        ])
            ->assertStatus(200);
    }

    /**
     * メールアドレスの変更に失敗する。
     */
    public function test_faild_change_email()
    {
        $this->json('POST', '/api/email/change', [
            'user_id' => $this->user->id,
            'email' => 'example2@example.com'
        ])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'email' => [
                        0 => "このメールアドレスはすでに登録されています。"
                    ]
                ]
            ]);
    }

    /**
     * パスワードの変更に成功する。
     */
    public function test_change_password()
    {
        $this->json('PUT', '/api/user/password', [
            'current_password' => 'password',
            'password' => 'Qwer1234',
            'password_confirmation' => 'Qwer1234',
        ])
            ->assertStatus(200);
    }

    /**
     * 新しいパスワードがバリデーションに引っかかった時にエラーメッセージを返す。。
     */
    public function test_faild_change_password()
    {
        $this->json('PUT', '/api/user/password', [
            'current_password' => 'password',
            'password' => 'qwer',
            'password_confirmation' => 'qwer',
        ])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'password' => [
                        0 => 'パスワードは8文字以上にしてください。',
                        1 => 'パスワードは英大文字と小文字をそれぞれ1つ以上使用してください。',
                        2 => 'パスワードは半角数字を1つ以上使用してください。',
                    ],
                ]
            ]);
    }

    /**
     * ユーザアカウントの削除が正常に完了する。
     */
    public function test_delete_user()
    {
        $this->json('DELETE', '/api/user/delete', [
            'id' => $this->user->id,
        ])
            ->assertStatus(200);
    }

    /**
     * ユーザアカウントの削除に失敗する。
     */
    public function test_faild_delete_user()
    {
        $this->json('DELETE', '/api/user/delete', [
            'id' => 0,
        ])
            ->assertStatus(400)
            ->assertJson([
                'message' => 'faild to delete account'
            ]);
    }
}
