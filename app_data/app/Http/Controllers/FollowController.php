<?php

namespace App\Http\Controllers;

use App\Http\Resources\FollowUserResource;
use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * ユーザのフォロー一覧を取得する
     *
     * @return \Illuminate\Http\Response
     */
    public function getFollowingUser($screen_name)
    {
        $user_id = User::where('screen_name', $screen_name)->value('id');
        return FollowUserResource::collection(User::find($user_id)->follows()->get());
    }

    /**
     * ユーザのフォロワー一覧を取得する
     *
     * @return \Illuminate\Http\Response
     */
    public function getFollowedUser($screen_name)
    {
        $user_id = User::where('screen_name', $screen_name)->value('id');
        return FollowUserResource::collection(User::find($user_id)->followers()->get());
    }
}
