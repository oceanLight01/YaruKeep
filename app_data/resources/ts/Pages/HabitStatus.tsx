import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HabitDeleteButton from '../Components/atoms/HabitDeleteButton';
import HabitDoneButton from '../Components/atoms/HabitDoneButton';
import { useAuth } from '../Components/Authenticate';
import DistributionCalendar from '../Components/ContributionCalendar';
import DiaryForm from '../Components/DiaryForm';
import DiaryList from '../Components/DiaryList';
import EditHabitForm from '../Components/EditHabitForm';
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
        diaries: [],
        canPostDiary: false,
        created_at: '',
        updated_at: '',
    });
    const [statusCode, setStatusCode] = useState<number>(0);
    const [editing, setEditing] = useState<boolean>(false);
    const habitId = useParams<{ screenName: string; id: string }>();
    const isLoginUser = auth?.userData?.id === HabitItem.user.id;
    const navigate = useNavigate();
    const params = useParams<{ screenName: string; id: string }>();

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
            diaries: props.diaries.map((item: any) => {
                return {
                    id: item.id,
                    habitId: item.habit_id,
                    text: item.text,
                    created_at: item.created_at,
                };
            }),
            canPostDiary: props.can_post_diary,
            created_at: props.created_at,
            updated_at: props.updated_at,
        };
    };

    useEffect(() => {
        axios
            .get(`/api/user/${params.screenName}/habits/${params.id}`)
            .then((res) => {
                setHabitItem(mapHabitItem(res.data.data));
                setStatusCode(res.data.status);
            })
            .catch((error) => {
                setStatusCode(error.response.status);
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

    const updateHabit = (habitItem: HabitItem) => {
        setHabitItem(mapHabitItem(habitItem));
        setEditing(false);
    };

    const deleteHabit = (habitId: number) => {
        if (window.confirm('ハビットトラッカーを削除します。もとに戻せませんがよろしいですか？')) {
            axios
                .delete(`/api/habits/${habitId}`)
                .then(() => {
                    navigate(`/user/${auth?.userData?.screen_name}`);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <PageRender status={statusCode}>
            <>
                {!editing ? (
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
                        {isLoginUser ? (
                            <>
                                <HabitDoneButton
                                    doneHabit={doneHabit}
                                    id={HabitItem.id}
                                    isDone={HabitItem.isDone}
                                />
                                <HabitDeleteButton id={HabitItem.id} deleteHabit={deleteHabit} />
                                {HabitItem.canPostDiary ? (
                                    <DiaryForm habitId={HabitItem.id} updateHabit={updateHabit} />
                                ) : null}
                            </>
                        ) : null}
                    </div>
                ) : isLoginUser ? (
                    <EditHabitForm
                        {...{
                            title: HabitItem.title,
                            description: HabitItem.description ? HabitItem.description : '',
                            categoryId: HabitItem.categoryId,
                            isPrivate: HabitItem.isPrivate ? 'true' : 'false',
                            habitId: HabitItem.id,
                            updateHabit: updateHabit,
                        }}
                    />
                ) : null}
                {isLoginUser ? (
                    <button onClick={() => setEditing(!editing)}>
                        {editing ? '戻る' : '編集する'}
                    </button>
                ) : null}
                <DiaryList diaries={HabitItem.diaries} user={HabitItem.user} />
            </>
        </PageRender>
    );
};

export default HabitStatus;
