import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../../Components/Atoms/Buttons/LogoutButton';
import { useMessage } from '../../Components/FlashMessageContext';

import styles from 'scss/Pages/Auth/EmailVerified.modules.scss';
import Button from '../../Components/Atoms/Buttons/Button';

const EmailVerified = () => {
    const flashMessage = useMessage();
    const [clicked, setClicked] = useState<boolean>(false);

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const sendVerifiedEmail = async () => {
        setClicked(true);
        try {
            await axios.post('api/email/verification-notification');

            if (!unmounted) {
                flashMessage?.setMessage('新しいメールを送信しました。');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'メールの再送信に失敗しました。',
                        error.response.status
                    );
                }
            }
        } finally {
            setClicked(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <p>Yarukeepへのご登録ありがとうございます！</p>
                <p>
                    登録されたメールアドレス宛にメールアドレス確認用リンクをお送りしました。
                    <br />
                    記載されたURLよりメールアドレスの確認を完了してください。
                </p>
                <div className={styles.button_wrapper}>
                    <Button
                        value="検証メールを再送信する"
                        clickHandler={sendVerifiedEmail}
                        disabled={clicked}
                    />
                </div>
                <div className={styles.logout_wrapper}>
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
};

export default EmailVerified;
