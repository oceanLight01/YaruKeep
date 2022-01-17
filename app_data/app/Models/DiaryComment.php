<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class DiaryComment extends Model
{
    use HasFactory;
    use NodeTrait;

    protected $fillable = [
        'comment'
    ];

    /**
     * このコメントを所持している日記を取得
     */
    public function diary()
    {
        return $this->belongsTo(Diary::class);
    }

    /**
     * このコメントを投稿したユーザを取得
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
