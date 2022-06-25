import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMessage } from '../Components/FlashMessageContext';

import styles from 'scss/Pages/ForgotPassword.modules.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormVaridateMessage from '../Components/Atoms/FormVaridateMessage';

type ForgotPasswordForm = {
    email: string;
};

const ForgotPassword = () => {
    const flashMessage = useMessage();
    const [clicked, setClicked] = useState<boolean>(false);
    const [formStatus, setFormStatus] = useState({ error: '' });
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordForm>({ mode: 'onBlur' });

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<ForgotPasswordForm> = (data) => {
        setClicked(true);
        setFormStatus({
            ...formStatus,
            error: '',
        });

        axios
            .post('/api/forgot-password', data)
            .then(() => {
                if (!unmounted) {
                    flashMessage?.setMessage('パスワードリセット用のメールを送信しました。');
                    setFormStatus({
                        ...formStatus,
                        error: '',
                    });
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    if (error.response.status >= 500) {
                        flashMessage?.setErrorMessage('', error.response.status);
                    } else {
                        setFormStatus({
                            ...formStatus,
                            error: error.response.data.errors.email[0],
                        });
                    }
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setClicked(false);
                }
            });
    };

    return (
        <div className={styles.forgot_password_container}>
            <div className={styles.forgot_password_wrapper}>
                <div className={styles.title}>
                    <h1>パスワードリセット</h1>
                </div>
                {formStatus.error.length > 0 && <p>{formStatus.error}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className={styles.mail_form}>
                    <p>
                        アカウントに登録したメールアドレスを入力してください。
                        <br />
                        パスワードリセット用メールを登録メールアドレス宛に送信します。
                    </p>
                    <div className={styles.form_input}>
                        <Controller
                            name="email"
                            control={control}
                            render={() => (
                                <TextField
                                    type="email"
                                    margin="dense"
                                    fullWidth
                                    {...register('email', { required: true })}
                                />
                            )}
                        />
                        {errors.email?.type === 'required' && (
                            <FormVaridateMessage message={'メールアドレスを入力してください。'} />
                        )}
                    </div>
                    <div className={styles.form_button_wrapper}>
                        <Button type="submit" variant="contained" disabled={clicked}>
                            送信
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
