import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from './Buttons/FollowButton';
import { useAuth } from '../Authenticate';

import styles from 'scss/Components/Atoms/UserItem.modules.scss';

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
        <li className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.profile_image_container}>
                    <div className={styles.profile_image_wrapper}>
                        <img
                            src={`/storage/profiles/${userItem.profile_image}`}
                            alt="プロフィール画像"
                            className={styles.profile_image}
                        />
                    </div>
                </div>
                <div className={styles.user_names}>
                    <div className={styles.name}>
                        <Link to={`/user/${userItem.screen_name}`}>{userItem.name}</Link>
                    </div>
                    <div className={styles.screen_name}>{userItem.screen_name}</div>

                    <div className={styles.follow_button_wrapper}>
                        {auth?.userData?.id !== userItem.id && <FollowButton {...buttonProps} />}
                    </div>
                    {userItem.followed_by && (
                        <div className={styles.is_follow}>フォローされています</div>
                    )}
                </div>
            </div>
        </li>
    );
};

export default UserItem;
