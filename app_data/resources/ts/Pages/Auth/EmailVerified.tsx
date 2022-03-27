import React, { useState } from 'react';
import axios from 'axios';
import LogoutButton from '../../Components/atoms/LogoutButton';

const EmailVerified = () => {
    const [isSend, setIsSend] = useState<boolean>(false);
    const sendVerifiedEmail = () => {
        axios
            .post('api/email/verification-notification')
            .then(() => {
                setIsSend(true);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <p>
                登録されたメールアドレス宛にメールアドレス検証用リンクをお送りしました。
                <br />
                記載されたURLよりメールアドレスの検証を完了してください。
            </p>
            {isSend ? <p>新しいメールを送信しました。</p> : null}
            <button onClick={sendVerifiedEmail}>検証メールを再送信する</button>
            <LogoutButton />
        </>
    );
};

export default EmailVerified;
