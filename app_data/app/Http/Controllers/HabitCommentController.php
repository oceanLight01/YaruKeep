<?php

namespace App\Http\Controllers;

use App\Http\Resources\HabitResource;
use App\Models\Habit;
use App\Models\HabitComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HabitCommentController extends Controller
{
    /**
     * HabitCommentの新規作成
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'comment' => 'required|max:300',
        ]);

        if ($request->userId === Auth::id())
        {
            $comment = new HabitComment;
            $comment->user_id = $request->userId;
            $comment->habit_id = $request->itemId;
            $comment->parent_id = $request->parentId === null ? null : $request->parentId;
            $comment->comment = $request->comment;
            $comment->save();

            return new HabitResource(Habit::find($request->itemId));
        } else {
            return response(['message' => 'faild to post comment'], 400);
        }
    }

    /**
     * HabitCommentの削除
     *
     * @param  number  $id HabitCommentのid
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comment = HabitComment::where('id', $id);
        $habit_id = $comment->value('habit_id');

        if ($comment->exists() && $comment->value('user_id') === Auth::id())
        {
            $comment->delete();
            return new HabitResource(Habit::find($habit_id));
        } else {
            return response(['message' => 'faild to delete'], 400);
        }
    }
}
