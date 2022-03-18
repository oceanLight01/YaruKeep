import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LogoutButton from '../Components/atoms/LogoutButton';
import TopPageHabit from '../Components/TopPageHabit';

const Home = () => {
    return (
        <>
            <h1>ホーム画面</h1>
            <LogoutButton />
            <TopPageHabit />
        </>
    );
};

export default Home;
