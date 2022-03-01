<?php

namespace App\Http\Controllers;

use App\Http\Resources\DiaryResource;
use App\Models\Diary;
use App\Models\DiaryComment;
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

        if ($request->userId === Auth::id())
        {
            $comment = new DiaryComment;
            $comment->user_id = $request->userId;
            $comment->diary_id = $request->itemId;
            $comment->parent_id = $request->parentId === null ? null : $request->parentId;
            $comment->comment = $request->comment;
            $comment->save();

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
    public function destroy($id)
    {
        $comment = DiaryComment::where('id', $id);
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
