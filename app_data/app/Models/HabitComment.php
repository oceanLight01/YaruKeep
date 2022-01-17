<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class HabitComment extends Model
{
    use HasFactory;
    use NodeTrait;

    protected $fillable = [
        'comment'
    ];

    /**
     * このコメントを所持しているハビットトラッカーを取得
     */
    public function habit()
    {
        return $this->belongsTo(Habit::class);
    }

    /**
     * このコメントを投稿したユーザを取得
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
