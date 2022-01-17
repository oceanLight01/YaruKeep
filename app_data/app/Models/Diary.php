<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diary extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
    ];

    /**
     * この日記を所有しているハビットトラッカーを取得
     */
    public function habit()
    {
        return $this->belongsTo(Habit::class);
    }

    /**
     * 日記についているコメントを取得
     */
    public function comments()
    {
        return $this->hasMany(DiaryComment::class);
    }
}
