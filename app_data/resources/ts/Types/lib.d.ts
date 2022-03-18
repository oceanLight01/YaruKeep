type UserItem = {
    id: number;
    name: string;
    screen_name: string;
    profile: string;
    profile_image: string;
    following: boolean;
    followed_by: boolean;
    following_count: number;
    followers_count: number;
    created_at: string;
};

type HabitItem = {
    id: number;
    title: string;
    description: string;
    category_id: number;
    category_name: string;
    max_done_day: number;
    done_days_count: number;
    done_days_list: { [date: string]: number };
    is_private: boolean;
    is_done: boolean;
    user: {
        id: number;
        name: string;
        screen_name: string;
    };
    can_post_diary: boolean;
    comments: CommentItem[];
    created_at: string;
    updated_at: string;
};

type DiaryItem = {
    id: number;
    habit_id: number;
    user: {
        id: number;
        screen_name: string;
        name: string;
    };
    text: string;
    comments: CommentItem[];
    created_at: string;
};

type CommentItem = {
    id: number;
    comment: string;
    parent_id: number | null;
    item_id: number;
    user: {
        id: number;
        name: string;
        screen_name: string;
    };
    children: CommentItem[];
};

type NotificationType =
    | 'follow_notification'
    | 'habit_comment'
    | 'habit_comment_reply'
    | 'diary_comment'
    | 'diary_comment_reply';

type NotificationItem = {
    id: string;
    data: {
        type: NotificationType;
        user_id: number;
        name: string;
        screen_name: string;
        habit?: {
            habit_id: number;
            title: string;
        };
        diary?: {
            diary_id: number;
            habit_id: number;
        };
        text?: string;
    };
    read_at: string | null;
};
