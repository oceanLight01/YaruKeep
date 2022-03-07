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
    categoryId: number;
    categoryName: string;
    maxDoneDay: number;
    doneDaysCount: number;
    doneDaysList: { [date: string]: number };
    isPrivate: boolean;
    isDone: boolean;
    user: {
        id: number;
        name: string;
        screenName: string;
    };
    diaries: DiaryItem[];
    canPostDiary: boolean;
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
