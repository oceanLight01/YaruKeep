import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import FollowButton from '../Components/atoms/FollowButton';
import { useAuth } from '../Components/Authenticate';
import formatText from '../Components/FormatText';
import HabitTracker from '../Components/HabitTracker';
import Paginate from '../Components/Paginate';
import PageRender from './PageRender';

type UserData = {
    id: number;
    name: string;
    screen_name: string;
    profile: string;
    profile_image: string;
    following_count: number;
    followed_count: number;
    following: boolean;
    followed_by: boolean;
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

    const [paginateData, setPaginateData] = useState({
        perPage: 1,
        totalItem: 1,
        currentPage: 1,
    });

    const getUserData = (screenName?: string) => {
        axios
            .get(`/api/user/${screenName}`)
            .then((res) => {
                const data = res.data.data.user;
                setUserData(data);
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
                const data = res.data.data;
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

    const getUserHabits = (screenName?: string, page = paginateData.currentPage) => {
        axios
            .get(`/api/habits/${screenName}?page=${page}`)
            .then((res) => {
                setHabits(res.data.data);

                const paginate = res.data.meta;
                setPaginateData({
                    ...paginateData,
                    perPage: paginate.per_page,
                    totalItem: paginate.total,
                    currentPage: paginate.current_page,
                });
            })
            .catch((error) => {
                setStatusCode(error.response.status);
                console.error(error);
            });
    };

    const paginateHabit = (page: number) => {
        getUserHabits(screenName, page);
    };

    useEffect(() => {
        getUserData(screenName);
        getUserHabits(screenName);
    }, [locationPath]);

    return (
        <>
            <h1>ユーザページ</h1>
            <PageRender status={statusCode}>
                <>
                    <div>
                        <p>ID:{userData?.id}</p>
                        <p>name:{userData?.name}</p>
                        <p>UserID{userData?.screen_name}</p>
                        <p>Profile:{formatText(userData?.profile!)}</p>
                        <img
                            src={`/storage/profiles/${userData?.profile_image}`}
                            alt="プロフィール画像"
                        />
                        {auth?.userData?.id !== userData?.id && (
                            <FollowButton
                                following={userData?.following!}
                                following_id={userData?.id!}
                                getUserData={() => getUserData(userData?.screen_name)!}
                            />
                        )}
                        <p>
                            <Link to={`/user/${userData?.screen_name}/following`}>
                                フォロー中:{userData?.following_count}
                            </Link>
                        </p>
                        <p>
                            <Link to={`/user/${userData?.screen_name}/followed`}>
                                フォロワー:{userData?.followed_count}
                            </Link>
                        </p>
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
                        {habits.length > 0 ? (
                            <Paginate
                                perPage={paginateData.perPage}
                                itemCount={paginateData.totalItem}
                                getData={paginateHabit}
                            />
                        ) : (
                            <p>ハビットトラッカーはありません。</p>
                        )}
                    </div>
                </>
            </PageRender>
        </>
    );
};

export default User;
