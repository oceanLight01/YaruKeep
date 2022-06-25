<?php

namespace App\Http\Controllers;

use App\Events\NotificationPusher;
use App\Http\Resources\DiaryResource;
use App\Models\Diary;
use App\Models\DiaryComment;
use App\Models\Habit;
use App\Models\User;
use App\Notifications\DiaryCommentNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiaryCommentController extends Controller
{
    /**
     * DiaryCommentの新規作成
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
            $comment = new DiaryComment;
            $comment->user_id = $user_id;
            $comment->diary_id = $request->itemId;
            $comment->parent_id = $request->parentId === null ? null : $request->parentId;
            $comment->comment = $request->comment;
            $comment->save();

            // 日記投稿主へ通知
            // 投稿主が自分自身なら通知をしない
            $diary = Diary::find($request->itemId);
            $comment_user_info = User::find($request->userId);
            $is_reply = !is_null($request->parentId);

            // リプライかどうか
            if ($is_reply)
            {
                // リプライ主と親コメント主が同じじゃない場合
                if (DiaryComment::find($request->parentId)->user_id !== Auth::id())
                {
                    $diary_comment = DiaryComment::find($request->parentId);
                    $notification_user = User::find($diary_comment->user_id);
                    $notification_user->notify(new DiaryCommentNotification($comment_user_info, $diary, $request->comment, $is_reply));

                    broadcast(new NotificationPusher($diary_comment->user_id));
                }
            } else  {
                // ハビットトラッカー主とコメント主が同じじゃない場合
                $notification_user_id = Habit::where('id', $diary->habit_id)->value('user_id');
                if ($notification_user_id !== Auth::id())
                {
                    $notification_user = User::find($notification_user_id);
                    $notification_user->notify(new DiaryCommentNotification($comment_user_info, $diary, $request->comment, $is_reply));

                    broadcast(new NotificationPusher($notification_user_id));
                }
            }

            return new DiaryResource(Diary::find($request->itemId));
        } else {
            return response(['message' => 'faild to post comment'], 400);
        }
    }

    /**
     * DiaryCommentの削除
     *
     * @param  number  $id DiaryCommentのid
     * @return \Illuminate\Http\Response
     */
    public function destroy($comment_id)
    {
        $comment = DiaryComment::where('id', $comment_id);
        $diary_id = $comment->value('diary_id');

        if ($comment->exists() && $comment->value('user_id') === Auth::id())
        {
            $comment->delete();
            return new DiaryResource(Diary::find($diary_id));
        } else {
            return response(['message' => 'faild to delete'], 400);
        }
    }
}
