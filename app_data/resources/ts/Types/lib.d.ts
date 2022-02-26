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
    created_at: string;
    updated_at: string;
};

type DiaryItem = { id: number; habitId: number; text: string; created_at: string };
