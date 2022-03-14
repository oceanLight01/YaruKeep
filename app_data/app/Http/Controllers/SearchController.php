<?php

namespace App\Http\Controllers;

use App\Http\Resources\HabitResource;
use App\Models\Habit;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * キーワードとカテゴリから検索結果を取得
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $keyword = $request->keyword;
        $categories = count($request->categories) === 0
            ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            : $request->categories;

        if(is_null($keyword) && count($request->categories) === 0) {
            return response(['message' => 'need value keyword or categories'], 400);
        }

        if (!empty($keyword))
        {
            $habits = Habit::where('is_private', 0)
                           ->where('title', 'Like', "%$keyword%")
                           ->orWhere('description', 'Like', "%$keyword%")
                           ->whereIn('category_id', $categories)
                           ->orderBy('id', 'desc')
                           ->get();
        } else {
            $habits = Habit::where('is_private', 0)
                           ->whereIn('category_id', $categories)
                           ->orderBy('id', 'desc')
                           ->get();
        }

        if ($habits->count() > 0)
        {
            return HabitResource::collection($habits);
        }

        return response(["message" => "Habittracker not found"], 204);
    }
}
