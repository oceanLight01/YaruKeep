<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoginUserResource;
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
}
