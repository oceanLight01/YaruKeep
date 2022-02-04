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
            <p>仮登録が完了しました。</p>
            <p>
                登録されたメールアドレス宛に本登録用メールをお送りしましたので、記載されたURLより本登録を完了してください。
            </p>
            {isSend ? <p>新しいメールを送信しました。</p> : null}
            <button onClick={sendVerifiedEmail}>本登録メールを再送信する</button>
            <LogoutButton />
        </>
    );
};

export default EmailVerified;
