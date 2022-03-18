import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LogoutButton from '../Components/atoms/LogoutButton';
import TopPageHabit from '../Components/TopPageHabit';

const Home = () => {
    const [notification, setNotification] = useState<number>(0);
    useEffect(() => {
        axios
            .get('/api/notifications')
            .then((res) => {
                setNotification(res.data.notification_count);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <h1>ホーム画面</h1>
            <p>通知件数：{notification}</p>
            <LogoutButton />
            <TopPageHabit />
        </>
    );
};

export default Home;
