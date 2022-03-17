import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authenticate';

const UserDeleteButton = () => {
    const auth = useAuth();
    const navigate = useNavigate();

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
                    console.error(error);
                });
        }
    };

    return <button onClick={deleteUser}>アカウントを削除</button>;
};

export default UserDeleteButton;
