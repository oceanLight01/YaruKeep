import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HabitDoneButton from '../Components/atoms/HabitDoneButton';
import { useAuth } from '../Components/Authenticate';
import DistributionCalendar from '../Components/ContributionCalendar';

const HabitStatus = () => {
    const auth = useAuth();
    const [HabitItem, setHabitItem] = useState<HabitItem>({
        id: 0,
        title: '',
        description: '',
        categoryId: 0,
        categoryName: '',
        maxDoneDay: -1,
        doneDaysCount: -1,
        doneDaysList: {},
        isPrivate: false,
        isDone: false,
        user: {
            id: 0,
            name: '',
            screenName: '',
        },
        created_at: '',
        updated_at: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorStatus, setErrorStatus] = useState<number>(0);
    const habitId = useParams<{ screenName: string; id: string }>();

    useEffect(() => {
        axios
            .get(`/api/habits/status/${habitId.id}`)
            .then((res) => {
                console.log(res);
                const item = res.data.data;
                setHabitItem({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    categoryId: item.category_id,
                    categoryName: item.category_name,
                    maxDoneDay: item.max_done_day,
                    doneDaysCount: item.done_days_count,
                    doneDaysList: item.done_days_list,
                    isPrivate: item.is_private,
                    isDone: item.is_done,
                    user: {
                        id: item.user.id,
                        name: item.user.name,
                        screenName: item.user.screen_name,
                    },
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                });
            })
            .catch((error) => {
                setErrorStatus(error.response.status);
            })
            .finally(() => {
                setIsLoading(true);
            });
    }, []);

    const doneHabit = (habitId: number) => {
        axios
            .post('/api/habits/done', { userId: auth?.userData?.id, id: habitId })
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return isLoading ? (
        errorStatus === 404 ? (
            <p>ハビットトラッカーが見つかりませんでした。すでに削除されている可能性があります。</p>
        ) : (
            <div>
                <h2>{HabitItem.title}</h2>
                <p>
                    {HabitItem.description
                        ? HabitItem.description.split('\n').map((str, index) => (
                              <React.Fragment key={index}>
                                  {str}
                                  <br />
                              </React.Fragment>
                          ))
                        : ''}
                </p>
                <p>カテゴリ:{HabitItem.categoryName}</p>
                <p>総達成日数:{HabitItem.doneDaysCount}日</p>
                <p>最大連続達成日数:{HabitItem.maxDoneDay}日</p>
                <p>作成日:{HabitItem.created_at}</p>
                <div>
                    <DistributionCalendar values={HabitItem.doneDaysList} />
                </div>
                {auth?.userData?.id === HabitItem.user.id ? (
                    <HabitDoneButton
                        doneHabit={doneHabit}
                        id={HabitItem.id}
                        isDone={HabitItem.isDone}
                    />
                ) : null}
            </div>
        )
    ) : (
        <div>
            <p>読み込み中...</p>
        </div>
    );
};

export default HabitStatus;
