import React, { useState } from 'react';
import { useAuth } from '../Components/Authenticate';
import formatText from '../Components/FormatText';
import UserSettingsForm from '../Components/UserSettingsForm';

const Settings = () => {
    const auth = useAuth();
    const [showSettingsForm, setShowSettingsForm] = useState<boolean>(false);

    return (
        <>
            {showSettingsForm ? (
                <UserSettingsForm setShowSettingsForm={setShowSettingsForm} />
            ) : (
                <>
                    <h2>ユーザ情報</h2>
                    <p>ユーザ名:{auth?.userData?.name}</p>
                    <p>ユーザID:{auth?.userData?.screen_name}</p>
                    <p>メールアドレス:{auth?.userData?.email}</p>
                    <p>プロフィール画像:{auth?.userData?.profile_image}</p>
                    <p>プロフィール:{formatText(auth?.userData?.profile!)}</p>
                </>
            )}
            <button onClick={() => setShowSettingsForm(!showSettingsForm)}>
                {showSettingsForm ? '戻る' : '編集する'}
            </button>
        </>
    );
};

export default Settings;
