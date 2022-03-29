import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/Authenticate';
import { useMessage } from '../FlashMessageContext';

const LogoutButton = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const flashMessage = useMessage();

    const logout = () => {
        if (window.confirm('ログアウトします。よろしいですか？')) {
            auth?.logout()
                .then(() => {
                    navigate('/login');
                })
                .catch((error) => {
                    flashMessage?.setErrorMessage(
                        'ログアウトに失敗しました。',
                        error.response.status
                    );
                });
        }
    };

    return <button onClick={logout}>ログアウト</button>;
};

export default LogoutButton;
