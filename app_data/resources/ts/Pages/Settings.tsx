import React, { useState } from 'react';
import UserDeleteButton from '../Components/atoms/UserDeleteButton';
import { useAuth } from '../Components/Authenticate';
import EmailChangeForm from '../Components/EmailChangeForm';
import PasswordChangeForm from '../Components/PasswordChangeForm';
import ProfileImageForm from '../Components/ProfileImageForm';
import UserSettingsForm from '../Components/UserSettingsForm';

import styles from './../../scss/Settings.modules.scss';

const Settings = () => {
    const auth = useAuth();
    const [showSettingsForm, setShowSettingsForm] = useState<boolean>(false);

    return (
        <div className={styles.settings_container}>
            <div className={styles.settings_wrapper}>
                <h1 className={styles.title}>設定</h1>
                <div className={styles.settings}>
                    <div className={styles.settings_section}>
                        <h2>ユーザプロフィール</h2>
                        <UserSettingsForm setShowSettingsForm={setShowSettingsForm} />
                    </div>
                    <div className={styles.settings_section}>
                        <h2>プロフィール画像</h2>
                        <ProfileImageForm />
                    </div>
                    <div className={styles.settings_section}>
                        <h2>メールアドレス変更</h2>
                        <p>現在のメールアドレス: {auth?.userData?.email}</p>
                        <EmailChangeForm />
                    </div>
                    <div className={styles.settings_section}>
                        <h2>パスワード変更</h2>
                        <PasswordChangeForm />
                    </div>
                    <div>
                        <h2>アカウント削除</h2>
                        <p>アカウントを削除します。一度削除するともとに戻せません。</p>
                        <UserDeleteButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
