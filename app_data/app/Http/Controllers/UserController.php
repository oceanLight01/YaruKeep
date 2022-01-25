<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * ユーザがログインしているかを判定
     *
     * @return \Illuminate\Http\Response
     */
    public function checkLogin()
    {
        if (Auth::check())
        {
            return response(["isLogin" => true], 200);
        } else {
            return response(["isLogin" => false], 200);
        }
    }
}
