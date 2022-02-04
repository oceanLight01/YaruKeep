import React from 'react';
import LogoutButton from '../Components/atoms/LogoutButton';
import { useAuth } from '../Components/Authenticate';

const Home = () => {
    const auth = useAuth();

    return (
        <>
            <h1>ホーム画面</h1>
            <p>ユーザ名：{auth?.userData?.name}</p>
            <LogoutButton />
        </>
    );
};

export default Home;
