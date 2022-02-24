<?php

namespace App\Http\Controllers;

use App\Models\Diary;
use Illuminate\Http\Request;

class DiaryController extends Controller
{
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

        dd($diary_latest);

        if (!$diary_latest)
        {
            $diary = new Diary;
            $diary->text = $request->text;
            $diary->habit_id = $request->habitId;
            $diary->save();

            return response(['message' => 'success'], 204);
        } else {
            return response(['message' => 'faild to post diary'], 400);
        }
    }
}
