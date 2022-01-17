<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    /**
     * カテゴリが設定されているハビットトラッカーを取得
     */
    public function habits()
    {
        return $this->hasMany(Habit::class);
    }
}
