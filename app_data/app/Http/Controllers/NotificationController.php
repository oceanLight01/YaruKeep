<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * ユーザの通知関連データの取得
     */
    public function index()
    {
        $user_id = Auth::id();

        $user = User::find($user_id);
        $user->unreadNotifications()->update(['read_at' => now()]);

        $notificate = $user->notifications()->cursorPaginate(20);

        // ページネーションのデータを取得
        $has_next = $notificate->hasMorePages();
        if ($has_next) {
            preg_match('/([\w]+)$/' ,$notificate->nextPageUrl(), $result);
            $result = $result[0];
        } else {
            $result = "";
        }

        return [
            'unread_notification' => NotificationResource::collection($user->unreadNotifications()->get()),
            'notification' => NotificationResource::collection($notificate),
            'next_cursor' => $result,
            'has_next' => $has_next,
            'notification_count' => $user->unreadNotifications()->count()
        ];
    }

    /**
     * ユーザの未読通知関連データを取得
     */
    public function unread()
    {
        $user_id = Auth::id();
        $user = User::find($user_id);

        return [
            'unread_notification' => NotificationResource::collection($user->unreadNotifications()->paginate(5)),
            'unread_notification_count' => $user->unreadNotifications()->count()
        ];
    }

    /**
     * 一件の通知を既読処理
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $notification_id = $request->id;
        $user = User::find(Auth::id());

        $notification = $user->notifications()->where('id', $notification_id)->update(['read_at' => now()]);

        return [
            'unread_notification' => NotificationResource::collection($user->unreadNotifications()->paginate(5)),
            'unread_notification_count' => $user->unreadNotifications()->count()
        ];
    }

    /**
     * 全件の通知を既読処理
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function allUpdate(Request $request)
    {
        $user = User::find(Auth::id());

        $notification = $user->unreadNotifications()->update(['read_at' => now()]);

        return [
            'unread_notification' => NotificationResource::collection($user->unreadNotifications()->paginate(5)),
            'unread_notification_count' => $user->unreadNotifications()->count()
        ];
    }
}
