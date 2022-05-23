import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMessage } from '../Components/FlashMessageContext';
import UserItem from '../Components/UserItem';
import Circular from '../Components/atoms/Circular';

import styles from './../../scss/FollowInfo.modules.scss';

const FollowingUser = () => {
    const flashMessage = useMessage();
    const [followingList, setFollowingList] = useState<UserItem[]>([]);
    const { screenName } = useParams<{ screenName: string }>();
    const [isLoding, setIsLoding] = useState<boolean>(true);
    let unmounted = false;

    useEffect(() => {
        axios
            .get(`/api/following/${screenName}`)
            .then((res) => {
                if (!unmounted) {
                    setFollowingList(res.data.data);
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'フォロー中ユーザーの取得に失敗しました。',
                        error.response.status
                    );
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setIsLoding(false);
                }
            });

        return () => {
            unmounted = true;
        };
    }, []);

    const updateFollowInfo = (userItem: UserItem, index: number) => {
        setFollowingList(
            followingList.map((user, key) => {
                return key === index ? userItem : user;
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
