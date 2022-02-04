<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'screen_name',
        'email',
        'password',
        'profile',
        'profile_image'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * ハビットトラッカーを取得
     */
    public function habits()
    {
        return $this->hasMany(Habit::class);
    }

    /**
     * フォローユーザを取得
     */
    public function follows()
    {
        return $this->belongsToMany(self::class, 'follows', 'following_id', 'user_id')->orderBy('follows.id', 'desc');
    }

    /**
     * フォロワーを取得
     */
    public function followers()
    {
        return $this->belongsToMany(self::class, 'follows', 'user_id', 'following_id')->orderBy('follows.id', 'desc');
    }

    /**
     * ハビットトラッカーのコメントを取得
     */
    public function habit_comments()
    {
        return $this->hasMany(HabitComment::class);
    }

    /**
     * 日記のコメントを取得
     */
    public function diary_comments()
    {
        return $this->hasMany(DiaryComment::class);
    }
}
