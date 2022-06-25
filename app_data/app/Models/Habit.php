<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Habit extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_private',
        'title',
        'description',
    ];

    /**
     * ハビットトラッカーを作成したユーザを取得
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ハビットトラッカーに関連するカテゴリを取得
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * ハビットを達成した日を取得
     */
    public function habit_done_days()
    {
        return $this->hasMany(HabitDoneDay::class);
    }

    /**
     * 日記を取得
     */
    public function diaries()
    {
        return $this->hasMany(Diary::class);
    }

    /**
     * 日記を最新順で取得
     */
    public function diariesLatest($habit_id)
    {
        $diaries = Diary::where('habit_id', $habit_id)->latest()->get();
        return $diaries;
    }

    /**
     * コメントを取得
     */
    public function habit_comments()
    {
        return $this->hasMany(HabitComment::class);
    }
}
