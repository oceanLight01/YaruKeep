<?php

namespace App\Http\Resources;

use App\Models\DiaryComment;
use Illuminate\Http\Resources\Json\JsonResource;

class DiaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $comment = DiaryComment::where('diary_id', $this->id);
        $tree = $comment->get()->toTree();

        $comment_count = $comment->count();

        return [
            'id' => $this->id,
            'habit_id' => $this->habit_id,
            'text' => $this->text,
            'user' => [
                'id' => $this->habit->user->id,
                'screen_name' => $this->habit->user->screen_name,
                'name' => $this->habit->user->name,
            ],
            'comments' => DiaryCommentResource::collection($tree),
            'comment_count' => $comment_count,
            'created_at' => $this->created_at->format('Y年n月j日 H:i'),
            'updated_at' => $this->updated_at,
        ];
    }
}
