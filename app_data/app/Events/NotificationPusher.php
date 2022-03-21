<?php

namespace App\Events;

use App\Http\Resources\NotificationResource;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationPusher implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user_id;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($user_id)
    {
        $this->user_id = $user_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return [
            new PrivateChannel('notification.' . $this->user_id),
        ];
    }

    public function broadcastWith()
    {
        $user = User::find($this->user_id);

        return [
            'unread_notification' => NotificationResource::collection($user->unreadNotifications()->paginate(5)),
            'unread_notification_count' => $user->unreadNotifications()->count(),
        ];
    }
}
