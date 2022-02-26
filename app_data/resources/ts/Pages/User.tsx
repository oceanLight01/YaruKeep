import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../Components/Authenticate';
import formatText from '../Components/FormatText';
import HabitTracker from '../Components/HabitTracker';
import PageRender from './PageRender';

type UserData = {
    id: number;
    name: string;
    screenName: string;
    profile: string;
    profileImage: string;
    followingCount: number;
    followedCount: number;
    created_at: string;
    updated_at: string;
};

const User = () => {
    const { screenName } = useParams<{ screenName: string }>();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [habits, setHabits] = useState<HabitItem[] | []>([]);
    const [statusCode, setStatusCode] = useState<number>(0);
    const locationPath = useLocation().pathname;
    const auth = useAuth();

    const mapHabitItem = (props: any): HabitItem => {
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
            diaries: props.diaries,
            canPostDiary: props.can_post_diary,
            created_at: props.created_at,
            updated_at: props.updated_at,
        };
    };

    const getUserData = (screenName?: string) => {
        axios
            .get(`/api/user/${screenName}`)
            .then((res) => {
                const data = res.data.data.user;
                setUserData({
                    id: data.id,
                    name: data.name,
                    screenName: data.screen_name,
                    profile: data.profile,
                    profileImage: data.profile_image,
                    followingCount: data.following_count,
                    followedCount: data.followed_count,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                });
                setHabits(
                    data.habits.map((item: any) => {
                        return mapHabitItem(item);
                    })
                );
                setStatusCode(res.data.status);
            })
            .catch((error) => {
                setStatusCode(error.response.status);
                console.error(error);
            });
    };

    const doneHabit = (habitId: number, index?: number) => {
        axios
            .post('/api/habits/done', { userId: auth?.userData?.id, id: habitId })
            .then((res) => {
                const data = mapHabitItem(res.data.data);
                if (index !== undefined) {
                    setHabits(
                        habits.map((habit, key) => {
                            return key === index ? data : habit;
                        })
                    );
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getUserData(screenName);
    }, [locationPath]);

    return (
        <>
            <h1>ユーザページ</h1>
            <PageRender status={statusCode}>
                <>
                    <div>
                        <p>ID:{userData?.id}</p>
                        <p>name:{userData?.name}</p>
                        <p>UserID{userData?.screenName}</p>
                        <p>Profile:{formatText(userData?.profile!)}</p>
                        <p>{userData?.profileImage}</p>
                        <p>フォロー中:{userData?.followingCount}</p>
                        <p>フォロワー:{userData?.followedCount}</p>
                    </div>
                    <hr />
                    <div>
                        <h2>ハビットトラッカー</h2>
                        <ul>
                            {habits.map((item, index: number) => {
                                return (
                                    <HabitTracker
                                        item={item}
                                        key={index}
                                        index={index}
                                        doneHabit={doneHabit}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                </>
            </PageRender>
        </>
    );
};

export default User;
