<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Models\HabitDoneDay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HabitController extends Controller
{
    /**
     * Habitの新規作成
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:50',
            'description' => 'max:300',
            'categoryId' => 'required|digits_between:1,15',
            'isPrivate' => 'required|boolean'
        ]);

        if ($request->userId === Auth::id())
        {
            $habit = new Habit;
            $habit->user_id = $request->userId;
            $habit->title = $request->title;
            $habit->description = $request->description;
            $habit->category_id = $request->categoryId;
            $habit->is_private = $request->isPrivate;
            $habit->save();

            return response(['message' => 'success'], 201);
        } else {
            return response(['message' => 'failed'], 400);
        }
    }

    /**
     * Habitの目標達成時の処理
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function isDone(Request $request)
    {
        if ($request->userId === Auth::id())
        {
            $now_time = date('Y-m-d');
            $habit_id = $request->id;
            $is_already_done = HabitDoneDay::where('habit_id', $habit_id)
                                        ->whereDate('created_at', $now_time)
                                        ->exists();

            $is_done_yesterday = HabitDoneDay::where('habit_id', $habit_id)
                                        ->latest()
                                        ->whereDate('created_at', date('Y-m-d', strtotime('-1 day')))
                                        ->exists();
            $habit = Habit::find($habit_id);

            if (!$is_already_done)
            {
                $habit_day = new HabitDoneDay;
                $habit_day->habit_id = $habit_id;
                $habit_day->save();

                // Habitの連続達成日数の処理
                $count = $habit->done_days_count;
                if ($is_done_yesterday)
                {
                    $count++;
                } else {
                    $count = 1;
                }
                $habit->done_days_count = $count;

                // Habitの最大連続達成日数の処理
                if ($count > $habit->max_done_day)
                {
                    $habit->max_done_day = $count;
                }
                $habit->save();
            }

            return response(['message' => 'success'], 200);
        } else {
            return response(['message' => 'Faild to update Habit'], 403);
        }
    }
}
