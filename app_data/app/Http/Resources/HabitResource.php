<?php

namespace App\Http\Resources;

use App\Models\HabitDoneDay;
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

        $done_days = HabitDoneDay::where('habit_id', $this->id)
                                ->latest()
                                ->whereDate('created_at', '>', date('Y-m-d', strtotime('-1 year')))
                                ->limit(365)
                                ->get();

        $done_days_list = [];
        foreach ($done_days as $date)
        {
            $done_days_list[$date->created_at->format('Y-m-d')] = 1;
        }

        $already_done = isset($done_days[0]) && $done_days[0]->created_at->format('Y-m-d') === date('Y-m-d');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category_name' => $this->category->category,
            'done_days_count' => $this->done_days_count,
            'done_days_list' => $done_days_list,
            'max_done_day' => $this->max_done_day,
            'is_private' => $is_private,
            'is_done' => $already_done,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'screen_name' => $this->user->screen_name,
            ],
            'created_at' => $this->created_at->format('Y年n月j日 H:i'),
            'updated_at' => $this->updated_at
        ];
    }
}
