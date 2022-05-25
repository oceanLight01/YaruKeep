import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import FollowButton from '../Components/atoms/FollowButton';
import { useAuth } from '../Components/Authenticate';
import { useMessage } from '../Components/FlashMessageContext';
import formatText from '../Components/FormatText';
import HabitTracker from '../Components/HabitTracker';
import Paginate from '../Components/Paginate';
import PageRender from './PageRender';

import styles from './../../scss/User.modules.scss';
import Circular from '../Components/atoms/Circular';

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
    const [isFetch, setIsFetch] = useState<boolean>(true);

    const auth = useAuth();
    const flashMessage = useMessage();
    let unmounted = false;

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

                if (!unmounted) {
                    setUserData(data);
                    setStatusCode(res.data.status);
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    setStatusCode(error.response.status);
                }
            });
    };

    const doneHabit = (habitId: number, index?: number) => {
        axios
            .post('/api/habits/done', { userId: auth?.userData?.id, id: habitId })
            .then((res) => {
                flashMessage?.setMessage('今日の目標を達成しました🎉 お疲れ様です!');
                const data = res.data.data;
                if (!unmounted) {
                    if (index !== undefined) {
                        setHabits(
                            habits.map((habit, key) => {
                                return key === index ? data : habit;
                            })
                        );
                    }
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage('更新に失敗しました。', error.response.status);
                }
            });
    };

    const getUserHabits = (screenName?: string, page = paginateData.currentPage) => {
        setIsFetch(true);
        axios
            .get(`/api/habits/${screenName}?page=${page}`)
            .then((res) => {
                if (!unmounted) {
                    setHabits(res.data.data);

                    const paginate = res.data.meta;
                    setPaginateData({
                        ...paginateData,
                        perPage: paginate.per_page,
                        totalItem: paginate.total,
                        currentPage: paginate.current_page,
                    });
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    setStatusCode(error.response.status);
                }
            })
            .finally(() => {
                setIsFetch(false);
            });
    };

    const paginateHabit = (page: number) => {
        getUserHabits(screenName, page);
    };

    useEffect(() => {
        setUserData(null);
        setHabits([]);
        getUserData(screenName);
        getUserHabits(screenName);

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
                                        getUserData={() => getUserData(userData?.screen_name)!}
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
                        ) : (
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
                        )}
                        {habits.length > 0 ? (
                            <Paginate
                                perPage={paginateData.perPage}
                                itemCount={paginateData.totalItem}
                                getData={paginateHabit}
                            />
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
