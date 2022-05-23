import axios from 'axios';
import React, { useEffect, useState } from 'react';
import HabitTracker from './HabitTracker';

import styles from './../../scss/TopPageHabit.modules.scss';
import Circular from './atoms/Circular';

const TopPageHabit = () => {
    const [followUserHabits, setFollowUserHabits] = useState<HabitItem[]>([]);
    const [sameCategoryHabits, setSameCategoryHabits] = useState<HabitItem[]>([]);
    const [category, setCategory] = useState({ categoryId: 0, categoryName: '' });
    const [newestDoneHabits, setNewestDoneHabits] = useState<HabitItem[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    let unmounted = false;

    useEffect(() => {
        axios
            .get('/api/habits/top')
            .then((res) => {
                if (!unmounted) {
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
                }
            })
            .catch(() => {
                if (!unmounted) {
                    setError(true);
                }
            });

        return () => {
            unmounted = true;
        };
    }, []);

    return loading ? (
        <Circular />
    ) : error ? (
        <div>情報の取得に失敗しました。</div>
    ) : (
        <div>
            {followUserHabits.length > 0 ? (
                <div className={styles.container}>
                    <h2 className={styles.title}>フォロー中のユーザーのハビットトラッカー</h2>
                    <ul className={styles.habit_list}>
                        {followUserHabits.map((item, index) => {
                            return <HabitTracker item={item} index={index} key={index} />;
                        })}
                    </ul>
                </div>
            ) : null}
            {category.categoryId === null || sameCategoryHabits.length === 0 ? null : (
                <div className={styles.container}>
                    <h2 className={styles.title}>
                        「{category.categoryName}」カテゴリのハビットトラッカー
                    </h2>
                    <ul className={styles.habit_list}>
                        {sameCategoryHabits.map((item, index) => {
                            return <HabitTracker item={item} index={index} key={index} />;
                        })}
                    </ul>
                </div>
            )}
            {newestDoneHabits.length > 0 ? (
                <div className={styles.container}>
                    <h2 className={styles.title}>最新の達成ハビットトラッカー</h2>
                    <ul className={styles.habit_list}>
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
