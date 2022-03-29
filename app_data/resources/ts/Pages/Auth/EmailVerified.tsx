import React from 'react';
import axios from 'axios';
import LogoutButton from '../../Components/atoms/LogoutButton';
import { useMessage } from '../../Components/FlashMessageContext';

const EmailVerified = () => {
    const flashMessage = useMessage();
    const sendVerifiedEmail = () => {
        axios
            .post('api/email/verification-notification')
            .then(() => {
                flashMessage?.setMessage('新しいメールを送信しました。');
            })
            .catch((error) => {
                flashMessage?.setErrorMessage(
                    'メールの再送信に失敗しました。',
                    error.response.status
                );
            });
    };

    return (
        <>
            <p>
                登録されたメールアドレス宛にメールアドレス検証用リンクをお送りしました。
                <br />
                記載されたURLよりメールアドレスの検証を完了してください。
            </p>
            <button onClick={sendVerifiedEmail}>検証メールを再送信する</button>
            <LogoutButton />
        </>
    );
};

export default EmailVerified;
