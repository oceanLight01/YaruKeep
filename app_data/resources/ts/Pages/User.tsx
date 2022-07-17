import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import FollowButton from '../Components/Atoms/Buttons/FollowButton';
import { useAuth } from '../Components/Authenticate';
import { useMessage } from '../Components/FlashMessageContext';
import formatText from '../Components/Atoms/FormatText';
import HabitTracker from '../Components/HabitTracker';
import Paginate from '../Components/Atoms/Paginate';
import PageRender from './PageRender';

import styles from 'scss/Pages/User.modules.scss';
import Circular from '../Components/Atoms/Circular';

type UserData = {
    data: {
        user: {
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
    };
};

type Habits = {
    data: HabitItem[];
    meta: {
        per_page: number;
        total: number;
        current_page: number;
    };
};

const User = () => {
    const { screenName } = useParams<{ screenName: string }>();
    const [userData, setUserData] = useState<UserData['data']['user'] | null>(null);
    const [habits, setHabits] = useState<HabitItem[] | []>([]);
    const [statusCode, setStatusCode] = useState<number>(0);
    const locationPath = useLocation().pathname;
    const [isFetch, setIsFetch] = useState<boolean>(true);

    const auth = useAuth();
    const flashMessage = useMessage();
    let unmounted = false;

    const [paginateData, setPaginateData] = useState({
        perPage: 1,
        totalItem: 1,
        currentPage: 1,
    });

    const fetchUserData = async (screenName?: string) => {
        const user: AxiosResponse<UserData> = await axios.get(`/api/user/${screenName}`);

        if (!unmounted) {
            setUserData(user.data.data.user);
            setStatusCode(user.status);
        }
    };

    const fetchUserHabits = async (screenName?: string, page = paginateData.currentPage) => {
        setIsFetch(true);

        try {
            const userHabits: AxiosResponse<Habits> = await axios.get(
                `/api/habits/${screenName}?page=${page}`
            );

            if (!unmounted) {
                setHabits(userHabits.data.data);

                const paginate = userHabits.data.meta;
                setPaginateData({
                    ...paginateData,
                    perPage: paginate.per_page,
                    totalItem: paginate.total,
                    currentPage: paginate.current_page,
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response)
                if (!unmounted) {
                    setStatusCode(error.response.status);
                }
        }

        setIsFetch(false);
    };

    const doneHabit = async (habitId: number, index?: number) => {
        try {
            const done: AxiosResponse = await axios.post('/api/habits/done', {
                userId: auth?.userData?.id,
                id: habitId,
            });

            if (!unmounted) {
                flashMessage?.setMessage('今日の目標を達成しました🎉 お疲れ様です!');
                if (done.statusText === 'OK') {
                    setHabits(
                        habits.map((habit, key) => {
                            return key === index ? { ...habit, is_done: true } : habit;
                        })
                    );
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!unmounted) {
                    flashMessage?.setErrorMessage('更新に失敗しました。', error!.response!.status);
                }
            }
        }
    };

    const paginateHabit = (page: number) => {
        fetchUserHabits(screenName, page);
    };

    const toggleFollowing = () => {
        if (userData) {
            setUserData({
                ...userData,
                followed_count: userData.following
                    ? userData.followed_count - 1
                    : userData.followed_count + 1,
                following: !userData.following,
            });
        }
    };

    useEffect(() => {
        setUserData(null);
        setHabits([]);
        setStatusCode(0);

        const fetchUserAllData = async () => {
            Promise.all([fetchUserData(screenName), fetchUserHabits(screenName)]);
        };

        fetchUserAllData().catch((error) => {
            setStatusCode(error.response.status);
        });

        return () => {
            unmounted = true;
        };
    }, [locationPath]);

    return (
        <div className={styles.user_container}>
            <PageRender status={statusCode}>
                <div className={styles.user_wrapper}>
                    <div className={styles.user_profile_container}>
                        <div className={styles.user_profile_image_container}>
                            <div className={styles.user_profile_image_wrapper}>
                                <img
                                    className={styles.user_profile_image}
                                    src={`/storage/profiles/${userData?.profile_image}`}
                                    alt="プロフィール画像"
                                />
                            </div>
                        </div>
                        <div className={styles.user_profile_info}>
                            <div className={styles.user_profile_name}>
                                <h1>{userData?.name}</h1>
                                <h2>{userData?.screen_name}</h2>
                            </div>
                            <div className={styles.user_profile_text}>
                                <p>{formatText(userData?.profile!)}</p>
                            </div>
                            <div className={styles.user_profile_followinfo}>
                                <div>
                                    <Link to={`/user/${userData?.screen_name}/following`}>
                                        <span className={styles.count}>
                                            {userData?.following_count}
                                        </span>
                                        <span className={styles.text}>フォロー</span>
                                    </Link>
                                    <Link to={`/user/${userData?.screen_name}/followed`}>
                                        <span className={styles.count}>
                                            {userData?.followed_count}
                                        </span>
                                        <span className={styles.text}>フォロワー</span>
                                    </Link>
                                </div>
                                {auth?.userData?.id !== userData?.id && (
                                    <FollowButton
                                        following={userData?.following!}
                                        following_id={userData?.id!}
                                        toggleFollowing={toggleFollowing}
                                    />
                                )}
                            </div>
                            <div className={styles.user_followed}>
                                <span>{userData?.followed_by ? 'フォローされています' : null}</span>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h2 className={styles.title}>ハビットトラッカー</h2>
                        {isFetch ? (
                            <Circular />
                        ) : habits.length > 0 ? (
                            <>
                                <ul className={styles.habit_list}>
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

                                <Paginate
                                    perPage={paginateData.perPage}
                                    itemCount={paginateData.totalItem}
                                    currentPage={paginateData.currentPage}
                                    handleClick={paginateHabit}
                                />
                            </>
                        ) : (
                            <div>ハビットトラッカーはありません。</div>
                        )}
                    </div>
                </div>
            </PageRender>
        </div>
    );
};

export default User;
