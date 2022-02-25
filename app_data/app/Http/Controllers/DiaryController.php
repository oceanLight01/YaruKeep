<?php

namespace App\Http\Controllers;

use App\Http\Resources\HabitResource;
use App\Models\Diary;
use App\Models\Habit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiaryController extends Controller
{
    /**
     * 日記を一件取得
     *
     * @param  string $id ハビットトラッカーのID
     * @param  string $diary_id 日記のID
     * @return Diary
     */
    public function show($id, $diary_id)
    {
        $diary = Diary::where('id', $diary_id)->where('habit_id', $id)->exists();
        if ($diary)
        {
            return Diary::find($diary_id);
        } else {
            return response(['message' => 'not found diary data'], 404);
        }
    }

    /**
     * Diaryの新規作成
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|max:1000'
        ]);

        $now_time = date('Y-m-d');
        $diary_latest = Diary::where('habit_id', $request->habitId)
                             ->whereDate('created_at', $now_time)
                             ->exists();

        if (!$diary_latest)
        {
            $diary = new Diary;
            $diary->text = $request->text;
            $diary->habit_id = $request->habitId;
            $diary->save();

            return new HabitResource(Habit::find($request->habitId));
        } else {
            return response(['message' => 'faild to post diary'], 400);
        }
    }

    /**
     * 日記の削除
     *
     * @param  string $id 日記のID
     */
    public function destroy($id)
    {
        $diary = Diary::where('id', $id);
        $user_id = $diary->first()->habit->user->id;

        if ($diary->exists() && $user_id === Auth::id())
        {
            $diary->delete();
            return response(['message' => 'success'], 204);
        } else {
            return response(['message' => 'faild to delete'], 400);
        }
    }
}
