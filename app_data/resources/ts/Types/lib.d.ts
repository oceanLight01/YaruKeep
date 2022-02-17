type HabitItem = {
    title: string;
    description: string;
    categoryId: number;
    categoryName: string;
    maxDoneDay: number;
    doneDaysCount: number;
    doneDaysList: { [date: string]: number };
    isPrivate: boolean;
    created_at: string;
    updated_at: string;
};
