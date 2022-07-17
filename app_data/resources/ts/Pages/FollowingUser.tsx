import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMessage } from '../Components/FlashMessageContext';
import UserItem from '../Components/Atoms/UserItem';
import Circular from '../Components/Atoms/Circular';

import styles from 'scss/Pages/FollowInfo.modules.scss';

const FollowingUser = () => {
    const flashMessage = useMessage();
    const [followingList, setFollowingList] = useState<UserItem[]>([]);
    const { screenName } = useParams<{ screenName: string }>();
    const [isLoding, setIsLoding] = useState<boolean>(true);
    let unmounted = false;

    useEffect(() => {
        const fetchFollowingList = async () => {
            try {
                const followingList: AxiosResponse = await axios.get(
                    `/api/following/${screenName}`
                );

                if (!unmounted) {
                    setFollowingList(followingList.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (!unmounted) {
                        flashMessage?.setErrorMessage(
                            'フォロー中ユーザーの取得に失敗しました。',
                            error.response.status
                        );
                    }
                }
            } finally {
                if (!unmounted) {
                    setIsLoding(false);
                }
            }
        };

        fetchFollowingList();

        return () => {
            unmounted = true;
        };
    }, []);

    const updateFollowInfo = (index: number) => {
        setFollowingList(
            followingList.map((user, key) => {
                return key === index ? { ...user, following: !user.following } : user;
            })
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>フォロー中のユーザー</h1>
                {isLoding ? (
                    <Circular />
                ) : followingList.length > 0 ? (
                    <ul>
                        {followingList.map((item, index) => {
                            return (
                                <UserItem
                                    userItem={item}
                                    key={index}
                                    index={index}
                                    updateFollowInfo={updateFollowInfo}
                                />
                            );
                        })}
                    </ul>
                ) : (
                    <div className={styles.no_users}>フォロー中のユーザーはいません。</div>
                )}
            </div>
        </div>
    );
};

export default FollowingUser;
