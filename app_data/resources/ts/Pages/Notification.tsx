import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationItem from '../Components/NotificationItem';
import { useMessage } from '../Components/FlashMessageContext';

const Notification = () => {
    const flashMessage = useMessage();
    const [clicked, setClicked] = useState<boolean>(false);
    const [notification, setNotification] = useState<NotificationItem[]>([]);
    const [paginate, setPaginate] = useState({
        nextCursor: '',
        hasNext: false,
    });
    let unmounted = false;

    const getNotificationData = (nextCursor?: string) => {
        setClicked(true);

        let cursor = '';
        if (nextCursor !== undefined) {
            cursor = `?cursor=${nextCursor}`;
        }

        axios
            .get(`/api/notifications${cursor}`)
            .then((res) => {
                if (!unmounted) {
                    const data = res.data;
                    setNotification([...notification, ...data.notification]);
                    setPaginate({
                        ...paginate,
                        nextCursor: data.next_cursor,
                        hasNext: data.has_next,
                    });
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        '通知情報の取得に失敗しました。',
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

    useEffect(() => {
        getNotificationData();

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <div>
            <h2>通知</h2>
            <hr />
            <ul>
                {notification.map((item, index) => {
                    return <NotificationItem {...item} key={index} />;
                })}
            </ul>

            {paginate.hasNext && (
                <button onClick={() => getNotificationData(paginate.nextCursor)} disabled={clicked}>
                    さらに通知を取得
                </button>
            )}
        </div>
    );
};

export default Notification;
