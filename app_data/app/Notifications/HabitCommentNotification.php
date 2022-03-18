<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\Habit;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HabitCommentNotification extends Notification
{
    use Queueable;

    private User $user;
    private Habit $habit;
    private $text;
    private $is_reply;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user, Habit $habit, $text, $is_reply)
    {
        $this->user = $user;
        $this->habit = $habit;
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
            'habit' => [
                'habit_id' => $this->habit->id,
                'title' => $this->habit->title,
            ],
            'text' => $this->text,
            'type' => $this->is_reply ? 'HabitCommentReply' : 'HabitComment',
        ];
    }
}
