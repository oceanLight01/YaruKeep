<?php

namespace App\Http\Resources;

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
        return [
            'id' => $this->id,
            'habit_id' => $this->habit_id,
            'text' => $this->text,
            'user_id' => $this->habit->user->id,
            'created_at' => $this->created_at->format('Y年n月j日 H:i'),
            'updated_at' => $this->updated_at,
        ];
    }
}
