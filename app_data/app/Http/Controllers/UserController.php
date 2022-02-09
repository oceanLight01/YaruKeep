<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoginUserResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * ログインユーザのデータを取得
     *
     * @return \Illuminate\Http\Response
     */
    public function getLoginUserInfo()
    {
        if(Auth::check())
        {
            return new LoginUserResource(User::find(Auth::id()));
        } else {
            return response(['error' => 'Authorization failed.'], 401);
        }
    }

    /**
     * ユーザページでのユーザデータの取得
     *
     * @param string $id ユーザscreen_name
     * @return \Illuminate\Http\Response
     */
    public function getUserInfo($id)
    {
        $user = User::where("screen_name", $id);
        $user_data = $user->exists();
        if($user_data)
        {
            return new UserResource($user->first());
        } else {
            return response(['error' => 'User not found.'], 404);
        }
    }
}
