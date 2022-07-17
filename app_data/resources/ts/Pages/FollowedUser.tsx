import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMessage } from '../Components/FlashMessageContext';
import UserItem from '../Components/Atoms/UserItem';
import Circular from '../Components/Atoms/Circular';

import styles from 'scss/Pages/FollowInfo.modules.scss';

const FollowedUser = () => {
    const flashMessage = useMessage();
    const [followedList, setFollowedList] = useState<UserItem[]>([]);
    const { screenName } = useParams<{ screenName: string }>();
    const [isLoding, setIsLoding] = useState<boolean>(true);
    let unmounted = false;

    useEffect(() => {
        const fetchFollowedList = async () => {
            try {
                const followedList: AxiosResponse = await axios.get(`/api/followed/${screenName}`);

                if (!unmounted) {
                    setFollowedList(followedList.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    if (!unmounted) {
                        flashMessage?.setErrorMessage(
                            'フォローされているユーザーの取得に失敗しました。',
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

        fetchFollowedList();

        return () => {
            unmounted = true;
        };
    }, []);

    const updateFollowInfo = (index: number) => {
        setFollowedList(
            followedList.map((user, key) => {
                return key === index ? { ...user, following: !user.following } : user;
            })
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>フォロワーのユーザー</h1>
                {isLoding ? (
                    <Circular />
                ) : followedList.length > 0 ? (
                    <ul>
                        {followedList.map((item, index) => {
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
                    <div className={styles.no_users}>フォローされているユーザーはいません。</div>
                )}
            </div>
        </div>
    );
};

export default FollowedUser;
