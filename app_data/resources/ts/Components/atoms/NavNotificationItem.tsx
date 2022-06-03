import React from 'react';
import { useAuth } from '../Authenticate';

import styles from 'scss/Components/Atoms/NavNotificationItem.modules.scss';

type Props = {
    item: NotificationItem;
    updateNotification: (id: string, url: string) => void;
};

const NotificationItem = (props: Props) => {
    const auth = useAuth();
    const notificationType = props.item.data.type;
    const data = props.item.data;
    const itemId = props.item.id;
    const screenName = auth?.userData?.screen_name;

    switch (notificationType) {
        case 'follow_notification':
            return (
                <li
                    onClick={() => props.updateNotification(itemId, `/user/${data.screen_name}`)}
                    className={styles.notification_item}
                >
                    <p>{data.name}さんにフォローされました。</p>
                </li>
            );
        case 'habit_comment':
            return (
                <li
                    onClick={() =>
                        props.updateNotification(
                            itemId,
                            `/user/${screenName}/habit/${data.habit?.habit_id}`
                        )
                    }
                    className={styles.notification_item}
                >
                    <p>{data.name}さんがハビットトラッカーにコメントしました。</p>
                    <div className={styles.notification_item_habit}>
                        <p>{data.habit?.title}</p>
                    </div>
                </li>
            );
        case 'habit_comment_reply':
            return (
                <li
                    onClick={() =>
                        props.updateNotification(
                            itemId,
                            `/user/${screenName}/habit/${data.habit?.habit_id}`
                        )
                    }
                    className={styles.notification_item}
                >
                    <p>{data.name}さんがコメントに返信しました。</p>
                </li>
            );
        case 'diary_comment':
            return (
                <li
                    onClick={() =>
                        props.updateNotification(
                            itemId,
                            `/user/${screenName}/habit/${data.diary?.habit_id}/diary/${data.diary?.diary_id}`
                        )
                    }
                    className={styles.notification_item}
                >
                    <p>{data.name}さんが日記にコメントしました。</p>
                </li>
            );
        case 'diary_comment_reply':
            return (
                <li
                    onClick={() =>
                        props.updateNotification(
                            itemId,
                            `/user/${screenName}/habit/${data.diary?.habit_id}/diary/${data.diary?.diary_id}`
                        )
                    }
                    className={styles.notification_item}
                >
                    <p>{data.name}さんがコメントに返信しました。</p>
                </li>
            );
        default:
            return null;
    }
};

export default NotificationItem;
