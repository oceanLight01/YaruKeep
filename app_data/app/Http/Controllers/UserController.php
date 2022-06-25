<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoginUserResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
    public function getUserInfo($screen_name)
    {
        $user = User::where("screen_name", $screen_name);
        $user_data = $user->exists();
        if($user_data)
        {
            return new UserResource($user->first());
        } else {
            return response(['error' => 'User not found.'], 404);
        }
    }

    /**
     * ユーザプロフィール画像の更新
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeProfileImage(Request $request)
    {
        $validated = $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,jpg,png|max:1024|dimensions:max_width=1000,max_height=1000'
        ]);

        $user = User::find($request->user_id);
        $profile_image = $request->file('profile_image');
        $file_name = Auth::id().'_'.date("YmdHis").'.jpg';

        if ($profile_image !== null)
        {
            $image = \Image::make($profile_image);
            $image->resize(300, null, function($constraint)
            {
                $constraint->aspectRatio();
            });
            $jpeg_image = $image->encode('jpg');
            $save_path = storage_path('app/public/profiles/'.$file_name);
            $jpeg_image->save($save_path);

            if ($user->value('profile_image') !== 'default.png')
            {
                $old_file = $user->value('profile_image');
                Storage::disk('public')->delete('profiles/'.$old_file);
            }

            $user->profile_image = $file_name;
            $user->save();

            return response(['message' => 'success'], 204);
        } else {
            return response(['message' => 'Faild to upload profile image'], 400);
        }
    }

    /**
     * ユーザデータを削除
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        if (Auth::id() === $request->id) {
            $user = User::find($request->id);
            Auth::logout();
            $user->delete();
        } else {
            return response(['message' => 'faild to delete account'], 400);
        }
    }
}
