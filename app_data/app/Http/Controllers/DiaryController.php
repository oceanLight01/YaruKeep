<?php

namespace App\Http\Controllers;

use App\Http\Resources\DiaryResource;
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
    public function show($habit_id, $diary_id)
    {
        $diary = Diary::where('id', $diary_id)->where('habit_id', $habit_id)->exists();
        if ($diary)
        {
            return new DiaryResource(Diary::find($diary_id));
        } else {
            return response(['message' => 'not found diary data'], 404);
        }
    }

    /**
     * 日記の新規作成
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
        $diary_latest_post = Diary::where('habit_id', $request->habitId)
                             ->whereDate('created_at', $now_time)
                             ->exists();

        if (!$diary_latest_post)
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
     * 日記の更新
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $diary_id)
    {
        $validated = $request->validate([
            'text' => 'required|max:1000',
        ]);

        $diary = Diary::where('id', $diary_id)->first();
        $user_id = $diary->habit->user->id;

        if ($diary->exists() && $request->userId === $user_id)
        {
            $diary->text = $request->text;
            $diary->save();

            return new DiaryResource(Diary::find($diary_id));
        } else {
            return response(['message' => 'failed to update'], 400);
        }
    }

    /**
     * 日記の削除
     *
     * @param  string $id 日記のID
     */
    public function destroy($diary_id)
    {
        $diary = Diary::where('id', $diary_id)->first();
        $user_id;

        if ($diary) {
            $user_id = $diary->habit->user->id;
        }

        if ($diary && $user_id === Auth::id())
        {
            $diary->delete();
            return response(['message' => 'success'], 204);
        } else {
            return response(['message' => 'failed to delete'], 400);
        }
    }

    /**
     * ハビットトラッカーに関連する日記一覧を取得
     */
    public function getDiaries($habit_id)
    {
        $diary = Diary::where('habit_id', $habit_id);

        if ($diary->exists())
        {
            $is_private = $diary->first()->habit->is_private;

            if ($is_private === 0)
            {
                return DiaryResource::collection($diary->orderBy('id', 'desc')->paginate(20));
            } else {
                return response(['message' => 'Not found diaries'], 404);
            }
        } else {
            return response([], 204);
        }
    }
}
