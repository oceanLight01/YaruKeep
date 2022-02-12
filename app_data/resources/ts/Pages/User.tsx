import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import HabitTracker from '../Components/HabitTracker';

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

type HabitItem = {
    title: string;
    description: string;
    categoryId: number;
    categoryName: string;
    maxDoneDay: number;
    doneDaysCount: number;
    created_at: string;
    updated_at: string;
};

const User = () => {
    const { screenName } = useParams<{ screenName: string }>();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [habits, setHabits] = useState<HabitItem[] | []>([]);
    const locationPath = useLocation().pathname;

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
                        return {
                            title: item.title,
                            description: item.description,
                            categoryId: item.category_id,
                            categoryName: item.category_name,
                            maxDoneDay: item.max_done_day,
                            doneDaysCount: item.done_days_count,
                            created_at: item.created_at,
                            updated_at: item.updated_at,
                        };
                    })
                );
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
            <div>
                <p>ID:{userData?.id}</p>
                <p>name:{userData?.name}</p>
                <p>UserID{userData?.screenName}</p>
                <p>Profile:{userData?.profile}</p>
                <p>{userData?.profileImage}</p>
                <p>フォロー中:{userData?.followingCount}</p>
                <p>フォロワー:{userData?.followedCount}</p>
            </div>
            <hr />
            <div>
                <h2>ハビットトラッカー</h2>
                <ul>
                    {habits.map((item, index: number) => {
                        return <HabitTracker item={item} key={index} />;
                    })}
                </ul>
            </div>
        </>
    );
};

export default User;
