<?php

namespace App\Models;

use App\Notifications\ChangeEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class EmailReset extends Model
{
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        'user_id',
        'email',
        'token',
    ];

    /**
     * メールアドレス変更確認メールを送信する。
     *
     * @param $token
     */
    public function sendChangeEmailNotification($token)
    {
        $this->notify(new ChangeEmail($token));
    }

    /**
     * 新しいメールアドレスへメールを送信する
     *
     * @param \Illminate\Notifications\Notification $notification
     * @return string
     */
    public function routeNotificationForMail($notification)
    {
        return $this->email;
    }
}
