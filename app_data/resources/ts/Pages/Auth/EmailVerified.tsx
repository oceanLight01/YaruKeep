import React, { useEffect } from 'react';
import axios from 'axios';
import LogoutButton from '../../Components/atoms/LogoutButton';
import { useMessage } from '../../Components/FlashMessageContext';

const EmailVerified = () => {
    const flashMessage = useMessage();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const sendVerifiedEmail = () => {
        axios
            .post('api/email/verification-notification')
            .then(() => {
                if (!unmounted) {
                    flashMessage?.setMessage('新しいメールを送信しました。');
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'メールの再送信に失敗しました。',
                        error.response.status
                    );
                }
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
