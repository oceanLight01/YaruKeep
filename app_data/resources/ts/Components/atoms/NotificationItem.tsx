import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Authenticate';

import styles from 'scss/Components/Atoms/NotificationItem.modules.scss';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ReplyIcon from '@mui/icons-material/Reply';

const NotificationItem = (props: NotificationItem) => {
    const auth = useAuth();
    const notificationType = props.data.type;

    switch (notificationType) {
        case 'follow_notification':
            return (
                <li className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.icon_wrapper}>
                            <PersonAddAltRoundedIcon fontSize="large" />
                        </div>
                        <div className={styles.notification}>
                            <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                            さんにフォローされました。
                        </div>
                    </div>
                </li>
            );
        case 'habit_comment':
            return (
                <li className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.icon_wrapper}>
                            <ModeCommentIcon />
                        </div>
                        <div className={styles.notification}>
                            <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                            さんがハビットトラッカーにコメントしました。
                        </div>
                    </div>
                    <div className={styles.content}>
                        <Link
                            to={`/user/${auth?.userData?.screen_name}/habit/${props.data.habit?.habit_id}`}
                        >
                            <div className={styles.habit_title}>{props.data.habit?.title}</div>
                            <div>{props.data.text}</div>
                        </Link>
                    </div>
                </li>
            );
        case 'habit_comment_reply':
            return (
                <li className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.icon_wrapper}>
                            <ReplyIcon />
                        </div>
                        <div className={styles.notification}>
                            <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                            さんがコメントに返信しました。
                        </div>
                    </div>
                    <div className={styles.content}>
                        <Link
                            to={`/user/${auth?.userData?.screen_name}/habit/${props.data.habit?.habit_id}`}
                        >
                            <div>{props.data.text}</div>
                        </Link>
                    </div>
                </li>
            );
        case 'diary_comment':
            return (
                <li className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.icon_wrapper}>
                            <ModeCommentIcon />
                        </div>
                        <div className={styles.notification}>
                            <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                            さんが日記にコメントしました。
                        </div>
                    </div>
                    <div className={styles.content}>
                        <Link
                            to={`/user/${auth?.userData?.screen_name}/habit/${props.data.diary?.habit_id}/diary/${props.data.diary?.diary_id}`}
                        >
                            <div>{props.data.text}</div>
                        </Link>
                    </div>
                </li>
            );
        case 'diary_comment_reply':
            return (
                <li className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.icon_wrapper}>
                            <ReplyIcon />
                        </div>
                        <div className={styles.notification}>
                            <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                            さんがコメントに返信しました。
                        </div>
                    </div>
                    <div className={styles.content}>
                        <Link
                            to={`/user/${auth?.userData?.screen_name}/habit/${props.data.diary?.habit_id}/diary/${props.data.diary?.diary_id}`}
                        >
                            <div>{props.data.text}</div>
                        </Link>
                    </div>
                </li>
            );
        default:
            return null;
    }
};

export default NotificationItem;
