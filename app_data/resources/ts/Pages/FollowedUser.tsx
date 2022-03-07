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

    return (
        <>
            <h2>フォロワーのユーザー</h2>
            <hr />
            <ul>
                {followedList.map((item, index) => {
                    return <UserItem {...item} key={index} />;
                })}
            </ul>
        </>
    );
};

export default FollowedUser;
