import axios from 'axios';
import React, { useEffect, useState } from 'react';
import HabitTracker from './HabitTracker';

const TopPageHabit = () => {
    const [followUserHabits, setFollowUserHabits] = useState<HabitItem[]>([]);
    const [sameCategoryHabits, setSameCategoryHabits] = useState<HabitItem[]>([]);
    const [category, setCategory] = useState({ categoryId: 0, categoryName: '' });
    const [newestDoneHabits, setNewestDoneHabits] = useState<HabitItem[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        axios
            .get('/api/habits/top')
            .then((res) => {
                const data = res.data;

                setFollowUserHabits(data.following_user_habits);

                const category = data.same_category_habits;
                setSameCategoryHabits(category.habits);
                setCategory({
                    categoryId: category.category_id,
                    categoryName: category.category_name,
                });

                setNewestDoneHabits(data.newest_done_habits);

                setLoading(false);
            })
            .catch(() => {
                setError(true);
            });
    }, []);

    return loading ? (
        <p>読み込み中...</p>
    ) : error ? (
        <p>情報の取得に失敗しました。</p>
    ) : (
        <div>
            {followUserHabits.length > 0 ? (
                <div>
                    <h2>フォロー中のユーザーのハビットトラッカー</h2>
                    <ul>
                        {followUserHabits.map((item, index) => {
                            return <HabitTracker item={item} index={index} key={index} />;
                        })}
                    </ul>
                </div>
            ) : null}
            {category.categoryId === null || sameCategoryHabits.length === 0 ? null : (
                <div>
                    <>
                        <h2>「{category.categoryName}」カテゴリのハビットトラッカー</h2>
                        <ul>
                            {sameCategoryHabits.map((item, index) => {
                                return <HabitTracker item={item} index={index} key={index} />;
                            })}
                        </ul>
                    </>
                </div>
            )}
            {newestDoneHabits.length > 0 ? (
                <div>
                    <h2>最新の達成ハビットトラッカー</h2>
                    <ul>
                        {newestDoneHabits.map((item, index) => {
                            return <HabitTracker item={item} index={index} key={index} />;
                        })}
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

export default TopPageHabit;
