import axios from 'axios';
import React, { useEffect } from 'react';
import { useAuth } from '../Authenticate';
import { useMessage } from '../FlashMessageContext';

const UserDeleteButton = () => {
    const auth = useAuth();
    const flashMessage = useMessage();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    });

    const deleteUser = () => {
        if (
            window.confirm('アカウントを削除します。削除するともとに戻せませんがよろしいですか？')
        ) {
            axios
                .delete('/api/user/delete', { data: { id: auth?.userData?.id } })
                .then(() => {
                    auth?.logout();
                })
                .catch((error) => {
                    if (!unmounted) {
                        flashMessage?.setErrorMessage(
                            'アカウント削除に失敗しました。',
                            error.response.status
                        );
                    }
                });
        }
    };

    return <button onClick={deleteUser}>アカウントを削除</button>;
};

export default UserDeleteButton;
