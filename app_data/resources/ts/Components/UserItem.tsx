import React from 'react';
import { Link } from 'react-router-dom';

const UserItem = (props: UserItem) => {
    return (
        <li>
            <p>
                <Link to={`/user/${props.screen_name}`}>{props.name}</Link>
            </p>
            <p>{props.screen_name}</p>
            <p>{props.name}</p>
            <img src={`/storage/profiles/${props.profile_image}`} alt="プロフィール画像" />
            {props.following && <p>フォロー中</p>}
            {props.followed_by && <p>フォローされています</p>}
        </li>
    );
};

export default UserItem;
