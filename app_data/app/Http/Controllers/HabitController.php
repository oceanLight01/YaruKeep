<?php

namespace App\Http\Controllers;

use App\Http\Resources\HabitResource;
use App\Models\Follow;
use App\Models\Habit;
use App\Models\HabitDoneDay;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HabitController extends Controller
{
    /**
     * Habitのデータを一件取得
     *
     * @param  \Illuminate\Http\Request  $request
     * @return HabitResource
     */
    public function show(Request $request)
    {
        $screen_name = $request->screen_name;
        $user_id = User::where('screen_name', $screen_name)->value('id');

        $habit_id = $request->id;
        $habit = Habit::where('id', $habit_id);

        $habit_exists = $habit->where('user_id', $user_id)
                              ->exists();
        $is_private = $habit->value('is_private') === 1;
        $is_login_user_habit = $habit->value('user_id') === Auth::id();

        if ($habit_exists && $is_login_user_habit)
        {
            return new HabitResource(Habit::find($habit_id));
        } else if ($habit_exists && !$is_private)
        {
            return new HabitResource(Habit::find($habit_id));
        } else {
            return response(['message' => 'not found habit data'], 404);
        }
    }

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
            'categoryId' => 'required|integer|between:1,15',
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
            } else {
                return response(["message" => "This habit already done."], 400);
            }

            return new HabitResource(Habit::find($habit_id));
        } else {
            return response(['message' => 'Faild to update Habit'], 403);
        }
    }

    /**
     * Habitの更新
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|max:50',
            'description' => 'max:300',
            'categoryId' => 'required|integer|between:1,15',
            'isPrivate' => 'required|boolean'
        ]);

        if ($request->userId === Auth::id() && $id === (string)$request->habitId)
        {
            $habit = Habit::find($id);
            $habit->title = $request->title;
            $habit->description = $request->description;
            $habit->category_id = $request->categoryId;
            $habit->is_private = $request->isPrivate;
            $habit->save();

            return new HabitResource(Habit::find($id));
        } else {
            return response(['message' => 'failed'], 400);
        }
    }

    /**
     * Habitの削除
     *
     * @param  number  $id Habitのid
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $habit = Habit::where('id', $id);
        if ($habit->exists() && $habit->first()->user_id === Auth::id())
        {
            $habit->delete();
            return response(['message' => 'success'], 204);
        } else {
            return response(['message' => 'faild to delete'], 400);
        }
    }

    /**
     * トップページに表示する以下のハビットトラッカーを取得
     *
     * ・フォロー中ユーザのハビットトラッカー
     * ・作成したハビットトラッカーと同カテゴリのもの
     * ・達成日時が新しいハビットトラッカー
     */
    public function getTopPageHabits()
    {
        $user_id = Auth::id();

        // フォロー中のユーザのハビットトラッカーを取得
        $following_list = Follow::where('user_id', $user_id)->pluck('following_user_id');
        $following_user_habits = Habit::where('is_private', 0)
                                      ->whereIn('user_id', $following_list)
                                      ->inRandomOrder()
                                      ->limit(10)
                                      ->get();

        // 自身が投稿しているハビットトラッカーと同じカテゴリのハビットトラッカーを取得
        $category = Habit::where('user_id', $user_id);
        $category_id = null;
        $same_category_habits = [];
        $category_name = null;
        $category_list = [
            'ビジネススキル',
            '自己啓発',
            'プログラミング・開発',
            'スキルアップ',
            '資格取得',
            '外国語学習',
            '読書',
            '芸術',
            'ゲーム',
            '創作',
            '趣味',
            '学習',
            '運動・スポーツ',
            '料理',
            '美容・健康',
        ];

        if ($category->exists())
        {
            $category_ids = $category->groupBy('category_id')
                                     ->inRandomOrder()
                                     ->pluck('category_id');

            // 自身が投稿しているカテゴリかつ自身の投稿を除いた同カテゴリのハビットトラッカーが最低一件あるものを取得
            $category_random_id = Habit::where('is_private', 0)
                                       ->whereNotIn('user_id', [$user_id])
                                       ->whereIn('category_id', $category_ids)
                                       ->selectRaw('COUNT(*) as category_count, category_id')
                                       ->groupBy('category_id')
                                       ->having('category_count', '>', 0)
                                       ->inRandomOrder()
                                       ->value('category_id');

            $same_category_habits = Habit::where('is_private', 0)
                                         ->whereNotIn('user_id', [$user_id])
                                         ->where('category_id', $category_random_id)
                                         ->inRandomOrder()
                                         ->limit(10)
                                         ->get();

            $category_id = $category_random_id;
            $category_name = $category_list[$category_random_id - 1];
        }

        // 達成日時が最新のハビットトラッカーを取得
        $newest_done_habits = Habit::where('is_private', 0)
                                   ->whereNotIn('done_days_count', [0])
                                   ->latest('updated_at')
                                   ->limit(10)
                                   ->get();

        return [
            'following_user_habits' => HabitResource::collection($following_user_habits),
            'same_category_habits' => [
                'category_id' => $category_id,
                'category_name' => $category_name,
                'habits' => HabitResource::collection($same_category_habits),
            ],
            'newest_done_habits' => HabitResource::collection($newest_done_habits),
        ];
    }

    /**
     * ユーザごとのハビットトラッカーをページネーションで取得
     *
     * @param  \Illuminate\Http\Request  $request
     * @return HabitResource
     */
    public function getUserHabits(Request $request)
    {
        $user_id = User::where('screen_name', $request->screen_name)->value('id');
        $habit_data = Habit::where('user_id', $user_id);

        if (Auth::id() !== $user_id)
        {
            $habit_data = $habit_data->where('is_private', 0);
        }

        if ($user_id) {
            return HabitResource::collection($habit_data->orderBy('id', 'desc')
                                                    ->paginate(10));
        } else {
            return response(['message' => 'Faild get habits'], 400);
        }
    }
}
