import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserItem from '../Components/UserItem';

const FollowingUser = () => {
    const [followingList, setFollowingList] = useState<UserItem[]>([]);
    const { screenName } = useParams<{ screenName: string }>();

    useEffect(() => {
        axios
            .get(`/api/following/${screenName}`)
            .then((res) => {
                setFollowingList(res.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const updateFollowInfo = (userItem: UserItem, index: number) => {
        setFollowingList(
            followingList.map((user, key) => {
                return key === index ? userItem : user;
            })
        );
    };

    return (
        <>
            <h2>フォロー中のユーザー</h2>
            <hr />
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
        </>
    );
};

export default FollowingUser;
