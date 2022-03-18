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
        return [
            'unread_notification' => NotificationResource::collection($user->unreadNotifications()->get()),
            'notification' => NotificationResource::collection($user->notifications()->get()),
            'notification_count' => $user->unreadNotifications()->count()
        ];
    }
}
