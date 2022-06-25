<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DiaryCommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'children' => DiaryCommentResource::collection($this->children),
            'id' => $this->id,
            'item_id' => $this->diary_id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'screen_name' => $this->user->screen_name,
                'profile_image' => $this->user->profile_image,
            ],
            'parent_id' => $this->parent_id,
            'comment' => $this->comment,
            'created_at' => $this->created_at
        ];
    }
}
