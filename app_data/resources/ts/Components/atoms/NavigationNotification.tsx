import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authenticate';
import { useMessage } from '../FlashMessageContext';
import NavNotificationItem from './NavNotificationItem';

import styles from 'scss/Components/Atoms/Notification.modules.scss';
import { Badge } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const NavigationNotification = () => {
    const [clicked, setClicked] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const auth = useAuth();
    const flashMessage = useMessage();

    const [notification, setNotification] = useState<{
        count: number;
        notificationList: NotificationItem[];
    }>({ count: 0, notificationList: [] });

    useEffect(() => {
        setClicked(false);

        if (location.pathname === '/notifications' && notification.notificationList.length > 0) {
            readAllNotification();
        }
    }, [location.pathname]);

    const getUnreadNotifications = () => {
        axios
            .get('/api/notifications/unread')
            .then((res) => {
                const data = res.data;
                setNotification({
                    ...notification,
                    count: data.unread_notification_count,
                    notificationList: data.unread_notification,
                });
            })
            .catch((error) => {
                flashMessage?.setErrorMessage(
                    '通知情報の取得に失敗しました。',
                    error.response.status
                );
            });
    };

    useEffect(() => {
        getUnreadNotifications();

        window.Echo.private(`notification.${auth?.userData?.id}`).listen(
            'NotificationPusher',
            (res: any) => {
                setNotification({
                    ...notification,
                    count: res.unread_notification_count,
                    notificationList: res.unread_notification,
                });
            }
        );
    }, []);

    const updateNotification = (id: string, url: string) => {
        setClicked(false);

        axios
            .put('/api/notifications', { id: id })
            .then((res) => {
                const data = res.data;
                setNotification({
                    ...notification,
                    count: data.unread_notification_count,
                    notificationList: data.unread_notification,
                });
            })
            .catch((error) => {
                flashMessage?.setErrorMessage(
                    '通知情報の更新に失敗しました。',
                    error.response.status
                );
            });

        navigate(url);
    };

    const readAllNotification = () => {
        setClicked(false);
        axios
            .put('/api/notifications/read')
            .then((res) => {
                const data = res.data;
                setNotification({
                    ...notification,
                    count: data.unread_notification_count,
                    notificationList: data.unread_notification,
                });
            })
            .catch((error) => {
                flashMessage?.setErrorMessage(
                    '通知情報の更新に失敗しました。',
                    error.response.status
                );
            });

        navigate('/notifications');
    };

    return (
        <div className={styles.notification_wrapper}>
            <Badge
                badgeContent={notification.count}
                color="primary"
                className={styles.notification_badge}
                onClick={() => setClicked(true)}
            >
                <NotificationsNoneIcon className={styles.notification_icon} />
            </Badge>
            <div
                className={`${styles.notification_inner} ${
                    clicked ? styles.notification_active : ''
                }`}
                onClick={() => setClicked(false)}
            ></div>
            <div className={`${styles.notification} ${clicked ? styles.notification_active : ''}`}>
                {notification.notificationList.length > 0 ? (
                    <ul>
                        {notification.notificationList.map((item, index) => {
                            return (
                                <NavNotificationItem
                                    {...{ item, updateNotification }}
                                    key={index}
                                />
                            );
                        })}
                    </ul>
                ) : (
                    <p className={styles.notification_no_item}>通知はありません</p>
                )}
                <p className={styles.notification_all_read} onClick={readAllNotification}>
                    全ての通知を確認
                </p>
            </div>
        </div>
    );
};

export default NavigationNotification;
