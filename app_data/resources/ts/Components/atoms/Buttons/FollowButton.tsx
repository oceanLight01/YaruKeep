import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Authenticate';
import { useMessage } from '../../FlashMessageContext';

import styles from 'scss/Components/Atoms/Buttons/FollowButton.modules.scss';

type Props = {
    following_id: number;
    following: boolean;
    index?: number;
    updateFollowInfo?: (index: number) => void;
    toggleFollowing?: () => void;
};

const FollowButton = (props: Props) => {
    const auth = useAuth();
    const flashMessage = useMessage();
    const [clicked, setClicked] = useState<boolean>(false);

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const followUser = () => {
        setClicked(true);
        const data = {
            user_id: auth?.userData?.id,
            following_user_id: props.following_id,
        };
        axios
            .post(`/api/follow`, data)
            .then(() => {
                if (props.updateFollowInfo) {
                    props.updateFollowInfo(props.index!);
                }

                if (props.toggleFollowing) {
                    props.toggleFollowing();
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'フォローに失敗しました。',
                        error.response.status
                    );
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setClicked(false);
                }
            });
    };

    const unFollowUser = () => {
        setClicked(true);
        const data = {
            user_id: auth?.userData?.id,
            following_user_id: props.following_id,
        };
        axios
            .post(`/api/unfollow`, data)
            .then(() => {
                if (props.updateFollowInfo) {
                    props.updateFollowInfo(props.index!);
                }

                if (props.toggleFollowing) {
                    props.toggleFollowing();
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'フォロー解除に失敗しました。',
                        error.response.status
                    );
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setClicked(false);
                }
            });
    };

    const handleClick = props.following ? unFollowUser : followUser;

    return (
        <button
            onClick={() => handleClick()}
            disabled={clicked}
            className={`${styles.follow_button} ${props.following && styles.following} ${
                clicked && styles.disable
            }`}
        >
            {props.following ? 'フォロー中' : 'フォロー'}
        </button>
    );
};

export default FollowButton;
