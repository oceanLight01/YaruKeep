<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UploadProfileImageTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    /**
     * プロフィール画像のアップロードに成功する
     */
    public function test_upload_profile_image()
    {
        Storage::Fake('profiles');

        $file = UploadedFile::fake()->image('profile.png', 400, 400);

        $this->json('POST', '/api/user/image', [
            'profile_image' => $file,
            'user_id' => 1
        ])
        ->assertstatus(204);

        // 再アップロード
        $file2 = UploadedFile::fake()->image('profile2.jpg', 600, 400);
        $this->json('POST', '/api/user/image', [
            'profile_image' => $file,
            'user_id' => 1
        ])
        ->assertstatus(204);
    }

    /**
     * プロフィール画像のアップロードに失敗する
     */
    public function test_fail_upload_profile_image()
    {
        Storage::Fake('profiles');

        $file = UploadedFile::fake()->image('profile.png', 1200, 1200);
        $file_svg = UploadedFile::fake()->image('profile.svg', 600, 600);

        // 画像のピクセル数が指定より大きい場合
        $this->json('POST', '/api/user/image', [
            'profile_image' => $file,
            'user_id' => 1
        ])
        ->assertstatus(422)
        ->assertJson([
            "message" => "The given data was invalid.",
            "errors" => [
                "profile_image" => [
                    "プロフィール画像は1辺を1000ピクセル以下にしてください。"
                ]
            ]]
        );

        // 画像のファイルが指定以外のものの場合
        $this->json('POST', '/api/user/image', [
            'profile_image' => $file_svg,
            'user_id' => 1
        ])
        ->assertstatus(422)
        ->assertJson([
            "message" => "The given data was invalid.",
            "errors" => [
                "profile_image" => [
                    "プロフィール画像の形式はjpeg, jpg, pngのいずれかにしてください。"
                ]
            ]]
        );
    }
}
