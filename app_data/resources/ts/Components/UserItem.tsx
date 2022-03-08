import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from './atoms/FollowButton';
import { useAuth } from './Authenticate';

type Props = {
    userItem: UserItem;
    index: number;
    updateFollowInfo: (userItem: UserItem, index: number) => void;
};

const UserItem = ({ userItem, index, updateFollowInfo }: Props) => {
    const auth = useAuth();
    const buttonProps = {
        following: userItem.following,
        following_id: userItem.id,
        index: index,
        updateFollowInfo: updateFollowInfo,
    };

    return (
        <li>
            <p>
                <Link to={`/user/${userItem.screen_name}`}>{userItem.name}</Link>
            </p>
            <p>{userItem.screen_name}</p>
            <p>{userItem.name}</p>
            <img src={`/storage/profiles/${userItem.profile_image}`} alt="プロフィール画像" />
            {auth?.userData?.id !== userItem.id && <FollowButton {...buttonProps} />}
            {userItem.followed_by && <p>フォローされています</p>}
        </li>
    );
};

export default UserItem;
