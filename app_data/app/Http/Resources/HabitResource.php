<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class HabitResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $is_private = $this->is_private === 1;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category_name' => $this->category->category,
            'done_days_count' => $this->done_days_count,
            'max_done_day' => $this->max_done_day,
            'is_private' => $is_private,
            'created_at' => $this->created_at->format('Y年n月j日 H:i'),
            'updated_at' => $this->updated_at
        ];
    }
}
