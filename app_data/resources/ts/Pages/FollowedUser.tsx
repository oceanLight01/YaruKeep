import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMessage } from '../Components/FlashMessageContext';
import UserItem from '../Components/UserItem';
import Circular from '../Components/atoms/Circular';

import styles from './../../scss/FollowInfo.modules.scss';

const FollowedUser = () => {
    const flashMessage = useMessage();
    const [followedList, setFollowedList] = useState<UserItem[]>([]);
    const { screenName } = useParams<{ screenName: string }>();
    const [isLoding, setIsLoding] = useState<boolean>(true);
    let unmounted = false;

    useEffect(() => {
        axios
            .get(`/api/followed/${screenName}`)
            .then((res) => {
                if (!unmounted) {
                    setFollowedList(res.data.data);
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'フォローされているユーザーの取得に失敗しました。',
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
        setFollowedList(
            followedList.map((user, key) => {
                return key === index ? userItem : user;
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
