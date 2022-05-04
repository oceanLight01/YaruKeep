import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMessage } from '../Components/FlashMessageContext';

import styles from './../../scss/PasswordReset.modules.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormVaridateMessage from '../Components/atoms/FormVaridateMessage';
import FormRule from '../Components/atoms/FormRule';

type ResetPasswordForm = {
    password: string;
    password_confirmation: string;
};

const ResetPassword = () => {
    const flashMessage = useMessage();
    const [clicked, setClicked] = useState<boolean>(false);

    const search = useLocation().search;
    const query = new URLSearchParams(search);
    const pathname = useLocation().pathname;
    const token = pathname.match(/[\w]+$/g);
    const navigate = useNavigate();

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        control,
    } = useForm<ResetPasswordForm>({ mode: 'onBlur' });

    const onSubmit: SubmitHandler<ResetPasswordForm> = (data) => {
        setClicked(true);

        const postData = {
            ...data,
            email: decodeURI(query.get('email')!),
            token: token![0],
        };

        axios
            .post('/api/reset-password', postData)
            .then(() => {
                if (!unmounted) {
                    flashMessage?.setMessage('パスワードをリセットしました。');
                    navigate('/login');
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    flashMessage?.setErrorMessage(
                        'パスワードのリセットに失敗しました。',
                        error.response.status
                    );
                }
            })
            .finally(() => {
                if (!unmounted) {
                    setClicked(false);
                }
            });
    };

    return (
        <div className={styles.password_reset_container}>
            <div className={styles.password_reset_wrapper}>
                <div className={styles.title}>
                    <h1>パスワードリセット</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.password_form}>
                    <div className={styles.form_input}>
                        <Controller
                            name="password"
                            control={control}
                            render={() => (
                                <TextField
                                    label="新しいパスワード"
                                    type="password"
                                    margin="dense"
                                    fullWidth
                                    {...register('password', {
                                        required: true,
                                        minLength: 8,
                                        maxLength: 64,
                                        pattern: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]+$/,
                                    })}
                                />
                            )}
                        />
                        <FormRule
                            rule={
                                '・8文字以上64文字以下  ・半角英大文字、半角英小文字、半角数字をそれぞれ最低１つ含む'
                            }
                        />
                        {errors.password?.type === 'required' && (
                            <FormVaridateMessage message={'パスワードを入力してください。'} />
                        )}
                        {errors.password?.type === 'minLength' && (
                            <FormVaridateMessage
                                message={'パスワードは８文字以上入力してください。'}
                            />
                        )}
                        {errors.password?.type === 'maxLength' && (
                            <FormVaridateMessage
                                message={'パスワードは64文字以下で入力してください。'}
                            />
                        )}
                        {errors.password?.type === 'pattern' && (
                            <FormVaridateMessage
                                message={
                                    'パスワードは半角英大文字、英小文字、数字を最低１つずつ使用してください。'
                                }
                            />
                        )}
                    </div>
                    <div className={styles.form_input}>
                        <Controller
                            name="password_confirmation"
                            control={control}
                            render={() => (
                                <TextField
                                    label="パスワード確認"
                                    type="password"
                                    margin="dense"
                                    fullWidth
                                    {...register('password_confirmation', {
                                        required: true,
                                        validate: (value) => value === getValues('password'),
                                    })}
                                />
                            )}
                        />
                        <FormRule rule={'・パスワードを再度入力'} />
                        {errors.password_confirmation?.type === 'required' && (
                            <FormVaridateMessage message={'確認用パスワードを入力してください。'} />
                        )}
                        {errors.password_confirmation?.type === 'validate' && (
                            <FormVaridateMessage message={'パスワードが一致しません。'} />
                        )}
                    </div>
                    <Button type="submit" variant="contained" disabled={clicked}>
                        パスワード変更
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
