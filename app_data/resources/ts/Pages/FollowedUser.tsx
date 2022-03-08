import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserItem from '../Components/UserItem';

const FollowedUser = () => {
    const [followedList, setFollowedList] = useState<UserItem[]>([]);
    const { screenName } = useParams<{ screenName: string }>();

    useEffect(() => {
        axios
            .get(`/api/followed/${screenName}`)
            .then((res) => {
                setFollowedList(res.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const updateFollowInfo = (userItem: UserItem, index: number) => {
        setFollowedList(
            followedList.map((user, key) => {
                return key === index ? userItem : user;
            })
        );
    };

    return (
        <>
            <h2>フォロワーのユーザー</h2>
            <hr />
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
        </>
    );
};

export default FollowedUser;
