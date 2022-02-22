import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HabitDoneButton from '../Components/atoms/HabitDoneButton';
import { useAuth } from '../Components/Authenticate';
import DistributionCalendar from '../Components/ContributionCalendar';
import PageRender from './PageRender';

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
    const [statusCode, setStatusCode] = useState<number>(0);
    const habitId = useParams<{ screenName: string; id: string }>();

    const mapHabitItem = (props: any) => {
        return {
            id: props.id,
            title: props.title,
            description: props.description,
            categoryId: props.category_id,
            categoryName: props.category_name,
            maxDoneDay: props.max_done_day,
            doneDaysCount: props.done_days_count,
            doneDaysList: props.done_days_list,
            isPrivate: props.is_private,
            isDone: props.is_done,
            user: {
                id: props.user.id,
                name: props.user.name,
                screenName: props.user.screen_name,
            },
            created_at: props.created_at,
            updated_at: props.updated_at,
        };
    };

    useEffect(() => {
        axios
            .get(`/api/habits/status/${habitId.id}`)
            .then((res) => {
                setHabitItem(mapHabitItem(res.data.data));
            })
            .catch((error) => {
                setStatusCode(error.response.status);
            })
            .finally(() => {
                setIsLoading(true);
            });
    }, []);

    const doneHabit = (habitId: number) => {
        axios
            .post('/api/habits/done', { userId: auth?.userData?.id, id: habitId })
            .then((res) => {
                setHabitItem(mapHabitItem(res.data.data));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return isLoading ? (
        <PageRender status={statusCode}>
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
        </PageRender>
    ) : (
        <div>
            <p>読み込み中...</p>
        </div>
    );
};

export default HabitStatus;
