import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authenticate';
import { useMessage } from '../../FlashMessageContext';

const LogoutButton = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const flashMessage = useMessage();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const logout = () => {
        if (window.confirm('ログアウトします。よろしいですか？')) {
            auth?.logout()
                .then(() => {
                    navigate('/login');
                })
                .catch((error) => {
                    if (!unmounted) {
                        flashMessage?.setErrorMessage(
                            'ログアウトに失敗しました。',
                            error.response.status
                        );
                    }
                });
        }
    };

    return <div onClick={logout}>ログアウト</div>;
};

export default LogoutButton;
