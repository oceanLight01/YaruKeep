<?php

namespace App\Http\Resources;

use App\Models\Follow;
use App\Models\Habit;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $habit_data = Habit::where('user_id', $this->id);
        if (Auth::id() === $this->id)
        {
            $habits = $habit_data->get();
        } else {
            $habits = $habit_data->where('is_private', 0)->get();
        }

        $following_count = Follow::where('following_user_id', $this->id)->count();
        $followed_count = Follow::where('user_id', $this->id)->count();

        return [
            'user' => [
                'id' => $this->id,
                'name' => $this->name,
                'screen_name' => $this->screen_name,
                'profile' => $this->profile,
                'profile_image' => $this->profile_image,
                'habits' => $habits,
                'following_count' => $following_count,
                'followed_count' => $followed_count,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at
            ]
        ];
    }
}
