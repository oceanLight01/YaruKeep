<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\Diary;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DiaryCommentNotification extends Notification
{
    use Queueable;

    private User $user;
    private Diary $diary;
    private $text;
    private $is_reply;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user, Diary $diary, $text, $is_reply)
    {
        $this->user = $user;
        $this->diary = $diary;
        $this->text = $text;
        $this->is_reply = $is_reply;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'user_id' => $this->user->id,
            'name' => $this->user->name,
            'screen_name' => $this->user->screen_name,
            'diary' => [
                'diary_id' => $this->diary->id,
                'habit_id' => $this->diary->habit_id,
            ],
            'text' => $this->text,
            'type' => $this->is_reply ? 'DiaryCommentReply' : 'DiaryComment',
        ];
    }
}
