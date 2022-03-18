<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
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
}
