<?php

namespace App\Http\Controllers;

use App\Http\Resources\FollowUserResource;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        /**
     * ユーザをフォローする
     *
     * @param  \Illuminate\Http\Request  $request
     * @return FollowUserResource
     */
    public function follow(Request $request)
    {
        $user_id = $request->user_id;
        $following_user = $request->following_user_id;

        if ($user_id !== Auth::id())
        {
            return response(["message" => "Failed to follow"], 400);
        }

        $following = Follow::where('user_id', $user_id)->where('following_user_id', $following_user)->exists();
        if ($following)
        {
            return response(["message" => "This user has already following."], 400);
        }

        $follow = new Follow;
        $follow->user_id = $user_id;
        $follow->following_user_id = $following_user;
        $follow->save();

        return new FollowUserResource(User::find($following_user));
    }

    /**
     * ユーザのフォローを解除する
     *
     * @param  \Illuminate\Http\Request  $request
     * @return FollowUserResource
     */
    public function unfollow(Request $request)
    {
        $user_id = $request->user_id;
        $following_user = $request->following_user_id;

        if ($user_id !== Auth::id())
        {
            return response(["error" => "Failed to unfollow user"], 400);
        }

        $following = Follow::where('user_id', $user_id)->where('following_user_id', $following_user)->exists();
        if (!$following)
        {
            return response(["message" => "This user has already unfollowing."], 400);
        }

        $follow = Follow::where('user_id', $user_id)->where('following_user_id', $following_user)->first();
        $follow->delete();

        return new FollowUserResource(User::find($following_user));
    }
}
