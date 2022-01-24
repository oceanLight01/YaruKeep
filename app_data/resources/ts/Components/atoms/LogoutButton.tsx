import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const logout = () => {
        axios
            .post('/api/logout')
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return <button onClick={logout}>ログアウト</button>;
};

export default LogoutButton;
