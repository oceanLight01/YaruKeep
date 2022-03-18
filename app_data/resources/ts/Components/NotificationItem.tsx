import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Authenticate';

const NotificationItem = (props: NotificationItem) => {
    const auth = useAuth();
    const notificationType = props.data.type;

    switch (notificationType) {
        case 'follow_notification':
            return (
                <li>
                    <p>
                        <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                        さんにフォローされました。
                    </p>
                </li>
            );
        case 'habit_comment':
            return (
                <li>
                    <p>
                        <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                        さんがハビットトラッカーにコメントしました。
                    </p>
                    <div>
                        <Link
                            to={`/user/${auth?.userData?.screen_name}/habit/${props.data.habit?.habit_id}`}
                        >
                            <p>{props.data.habit?.title}</p>
                            <p>{props.data.text}</p>
                        </Link>
                    </div>
                </li>
            );
        case 'habit_comment_reply':
            return (
                <li>
                    <p>
                        <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                        さんがコメントに返信しました。
                    </p>
                    <div>
                        <Link
                            to={`/user/${auth?.userData?.screen_name}/habit/${props.data.habit?.habit_id}`}
                        >
                            <p>{props.data.text}</p>
                        </Link>
                    </div>
                </li>
            );
        case 'diary_comment':
            return (
                <li>
                    <p>
                        <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                        さんが日記にコメントしました。
                    </p>
                    <div>
                        <Link
                            to={`/user/${auth?.userData?.screen_name}/habit/${props.data.diary?.habit_id}/diary/${props.data.diary?.diary_id}`}
                        >
                            <p>{props.data.text}</p>
                        </Link>
                    </div>
                </li>
            );
        case 'diary_comment_reply':
            return (
                <li>
                    <p>
                        <Link to={`/user/${props.data.screen_name}`}>{props.data.name}</Link>
                        さんがコメントに返信しました。
                    </p>
                    <div>
                        <Link
                            to={`/user/${auth?.userData?.screen_name}/habit/${props.data.diary?.habit_id}/diary/${props.data.diary?.diary_id}`}
                        >
                            <p>{props.data.text}</p>
                        </Link>
                    </div>
                </li>
            );
        default:
            return null;
    }
};

export default NotificationItem;
