import React, { useEffect } from 'react';
import axios from 'axios';
import EmailChangeForm from '../Components/EmailChangeForm';
import { useAuth } from '../Components/Authenticate';
import { useMessage } from '../Components/FlashMessageContext';
import PasswordChangeForm from '../Components/PasswordChangeForm';
import ProfileImageForm from '../Components/ProfileImageForm';
import UserSettingsForm from '../Components/UserSettingsForm';

import styles from './../../scss/Settings.modules.scss';
import Button from '../Components/atoms/Button';

const Settings = () => {
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

    return (
        <div className={styles.settings_container}>
            <div className={styles.settings_wrapper}>
                <h1 className={styles.title}>設定</h1>
                <div className={styles.settings}>
                    <div className={styles.settings_section}>
                        <h2>ユーザプロフィール</h2>
                        <UserSettingsForm />
                    </div>
                    <hr />
                    <div className={styles.settings_section}>
                        <h2>プロフィール画像</h2>
                        <ProfileImageForm />
                    </div>
                    <hr />
                    <div className={styles.settings_section}>
                        <h2>メールアドレス変更</h2>
                        <p>現在のメールアドレス: {auth?.userData?.email}</p>
                        <EmailChangeForm />
                    </div>
                    <hr />
                    <div className={styles.settings_section}>
                        <h2>パスワード変更</h2>
                        <PasswordChangeForm />
                    </div>
                    <hr />
                    <div className={styles.settings_section}>
                        <h2>アカウント削除</h2>
                        <p>アカウントを削除します。一度削除するともとに戻せません。</p>
                        <div className={styles.form_button_wrapper}>
                            <Button value="削除" color="error" clickHandler={deleteUser} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
