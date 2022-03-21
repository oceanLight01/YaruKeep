import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Authenticate';
import NavNotificationItem from './NavNotificationItem';

const NavigationNotification = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    const [notification, setNotification] = useState<{
        count: number;
        notificationList: NotificationItem[];
    }>({ count: 0, notificationList: [] });

    useEffect(() => {
        setIsOpen(false);

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
                console.error(error);
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
        setIsOpen(false);
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
                console.error(error);
            });

        navigate(url);
    };

    const readAllNotification = () => {
        setIsOpen(false);
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
                console.error(error);
            });

        navigate('/notifications');
    };

    return (
        <div>
            {isOpen ? (
                <div>
                    <div onClick={() => setIsOpen(false)}>閉じる</div>
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
                        <p>通知はありません</p>
                    )}
                    <p onClick={readAllNotification}>全ての通知を確認</p>
                </div>
            ) : (
                <p onClick={() => setIsOpen(true)}>通知：{notification.count}</p>
            )}
        </div>
    );
};

export default NavigationNotification;
