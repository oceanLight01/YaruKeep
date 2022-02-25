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
    diaries: { id: number; habitId: number; text: string; created_at: string }[];
    canPostDiary: boolean;
    created_at: string;
    updated_at: string;
};
