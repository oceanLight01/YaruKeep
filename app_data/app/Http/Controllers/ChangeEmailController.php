<?php

namespace App\Http\Controllers;

use App\Models\EmailReset;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ChangeEmailController extends Controller
{
    /**
     * 新しいメールアドレス宛に確認メールを送信する
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function sendChangeEmailLink(Request $request)
    {
        $old_email = User::where('id', $request->user_id)->value('email');
        $validated = $request->validate([
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($old_email),
            ]
        ]);

        $email = $request->email;
        $user_id = $request->user_id;

        $token = hash_hmac(
            'sha256',
            Str::random(40).$email,
            config('app.key')
        );

        if (EmailReset::where('user_id', $user_id)->exists())
        {
            $cange_email = EmailReset::where('user_id', $user_id)->first();
            $cange_email->email = $email;
            $cange_email->token = $token;
            $cange_email->save();
            // $cange_email->sendChangeEmailNotification($token);
        } else {
            $cange_email = new EmailReset;
            $cange_email->user_id = $user_id;
            $cange_email->email = $email;
            $cange_email->token = $token;
            $cange_email->save();
        }

        $cange_email->sendChangeEmailNotification($token);

        return response(['message' => '確認メールを送信しました。'], 200);
    }

    /**
     * メールアドレスの変更処理
     *
     * @param Request $request
     * @param $token
     */
    public function reset(Request $request, $token)
    {
        $email_resets = EmailReset::where('token', $token)->first();

        if ($email_resets && !$this->tokenExpired($email_resets->updated_at))
        {
            $user = User::find($email_resets->user_id);
            $user->email = $email_resets->email;
            $user->save();

            EmailReset::where('token', $token)->delete();

            return redirect('/settings');
        } else {
            if ($email_resets)
            {
                EmailReset::where('token', $token)->delete();
            }
            return redirexct('/settings');
        }
    }

    /**
     * トークンが有効期限切れかどうか判定
     *
     * @param string $updated_at
     * @return bool
     */
    protected function tokenExpired($updated_at)
    {
        $expires = 60 * 60;
        return Carbon::parse($updated_at)->addSeconds($expires)->isPast();
    }
}
