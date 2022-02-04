<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use App\Models\Follow;

class LoginUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $following_count = Follow::where('following_user_id', $this->id)->count();
        $followed_count = Follow::where('user_id', $this->id)->count();

        return [
            'user' => [
                'id' => $this->id,
                'name' => $this->name,
                'screen_name' => $this->screen_name,
                'email' => $this->email,
                'email_verified_at' => $this->email_verified_at,
                'profile' => $this->profile,
                'following_count' => $following_count,
                'followed_count' => $followed_count,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at
            ]
        ];
    }
}
