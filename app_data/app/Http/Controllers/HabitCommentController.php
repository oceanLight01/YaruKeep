<?php

namespace App\Http\Controllers;

use App\Http\Resources\HabitResource;
use App\Models\Habit;
use App\Models\HabitComment;
use App\Models\User;
use App\Notifications\HabitCommentNotification;
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

        $user_id = $request->userId;

        if ($user_id === Auth::id())
        {
            $comment = new HabitComment;
            $comment->user_id = $user_id;
            $comment->habit_id = $request->itemId;
            $comment->parent_id = $request->parentId === null ? null : $request->parentId;
            $comment->comment = $request->comment;
            $comment->save();


            // ハビットトラッカー投稿主へ通知
            // 投稿主が自分自身なら通知をしない
            $habit = Habit::find($request->itemId);
            $comment_user_info = User::find($request->userId);
            $is_reply = !is_null($request->parentId);

            // リプライかどうか
            if ($is_reply)
            {
                // リプライ主と親コメント主が同じじゃない場合
                if (HabitComment::find($request->parentId)->user_id !== Auth::id())
                {
                    $habit_comment = HabitComment::find($request->parentId);
                    $notification_user = User::find($habit_comment->user_id);
                    $notification_user->notify(new HabitCommentNotification($comment_user_info, $habit, $request->comment, $is_reply));
                }
            } else  {
                // ハビットトラッカー主とコメント主が同じじゃない場合
                if ($habit->user_id !== Auth::id())
                {
                        $notification_user = User::find($habit->user_id);
                        $notification_user->notify(new HabitCommentNotification($comment_user_info, $habit, $request->comment, $is_reply));
                }
            }

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
