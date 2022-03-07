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

    return (
        <>
            <h2>フォロー中のユーザー</h2>
            <hr />
            <ul>
                {followingList.map((item, index) => {
                    return <UserItem {...item} key={index} />;
                })}
            </ul>
        </>
    );
};

export default FollowingUser;
