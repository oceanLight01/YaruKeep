<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Pusher\Pusher;

class PushController extends Controller
{
    /**
     * Pusherのプライベートチャンネルを認証する
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function auth(Request $request)
    {
        $pusher = new Pusher(
            config('broadcasting.connections.pusher.key'),
            config('broadcasting.connections.pusher.secret'),
            config('broadcasting.connections.pusher.app_id'),
        );

        $channel_name = $request->channel_name;
        $socket_id = $request->socket_id;

        return $pusher->socket_auth($channel_name, $socket_id);
    }
}
