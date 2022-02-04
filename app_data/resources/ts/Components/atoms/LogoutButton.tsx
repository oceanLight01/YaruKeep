import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/Authenticate';

const LogoutButton = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    const logout = () => {
        if (window.confirm('ログアウトします。よろしいですか？')) {
            auth?.logout()
                .then(() => {
                    navigate('/login');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return <button onClick={logout}>ログアウト</button>;
};

export default LogoutButton;
