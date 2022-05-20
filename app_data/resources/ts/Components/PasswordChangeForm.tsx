import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from './Authenticate';
import { useMessage } from './FlashMessageContext';
import FormVaridateMessage from './atoms/FormVaridateMessage';
import ValidateCountInput from './ValidateCountInput';

import styles from './../../scss/SettingsForm.modules.scss';
import TextField from '@mui/material/TextField';
import Button from './atoms/Button';

type PasswordChangeForm = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

const PasswordChangeForm = () => {
    const auth = useAuth();
    const [clicked, setClicked] = useState<boolean>(false);
    const flashMessage = useMessage();
    const [formStatus, setFormStatus] = useState({
        errors: {
            curren_password: '',
            password: '',
        },
    });

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
        reset,
        control,
        watch,
    } = useForm<PasswordChangeForm>();

    const onSubmit: SubmitHandler<PasswordChangeForm> = (data) => {
        setClicked(true);

        const postData = {
            current_password: data.current_password,
            password: data.password,
            password_confirmation: data.password_confirmation,
        };

        auth?.changePassword(postData)
            .then(() => {
                if (!unmounted) {
                    flashMessage?.setMessage('パスワードを変更しました。');
                    setFormStatus({
                        ...formStatus,
                        errors: {
                            curren_password: '',
                            password: '',
                        },
                    });
                    reset();
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    if (error.response.status >= 500) {
                        flashMessage?.setErrorMessage('', error.response.status);
                    } else {
                        const errorMessage = error.response.data.errors;
                        setFormStatus({
                            ...formStatus,
                            errors: {
                                curren_password: errorMessage.current_password
                                    ? errorMessage.current_password[0]
                                    : '',
                                password: errorMessage.password ? errorMessage.password[0] : '',
                            },
                        });
                    }
                }
            })
            .finally(() => {
                setClicked(false);
            });
    };

    return (
        <>
            <div>
                {formStatus.errors.curren_password.length > 0 && (
                    <FormVaridateMessage message={formStatus.errors.curren_password} />
                )}
                {formStatus.errors.password.length > 0 && (
                    <FormVaridateMessage message={formStatus.errors.password} />
                )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.form_input}>
                    <label>現在のパスワード</label>
                    <Controller
                        name="current_password"
                        control={control}
                        render={() => (
                            <TextField
                                type="password"
                                margin="dense"
                                fullWidth
                                {...register('current_password', {
                                    required: true,
                                })}
                            />
                        )}
                    />
                    {errors.current_password?.type === 'required' && (
                        <FormVaridateMessage message="パスワードを入力してください。" />
                    )}
                </div>
                <div className={styles.form_input}>
                    <div className={styles.form_label}>
                        <label>新しいパスワード</label>
                        <ValidateCountInput text={watch('password')} limit={64} />
                    </div>
                    <Controller
                        name="password"
                        control={control}
                        render={() => (
                            <TextField
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
                    {errors.password?.type === 'required' && (
                        <FormVaridateMessage message="パスワードを入力してください。" />
                    )}
                    {errors.password?.type === 'minLength' && (
                        <FormVaridateMessage message="パスワードは８文字以上入力してください。" />
                    )}
                    {errors.password?.type === 'maxLength' && (
                        <FormVaridateMessage message="パスワードは64文字以下で入力してください。" />
                    )}
                    {errors.password?.type === 'pattern' && (
                        <FormVaridateMessage message="パスワードは半角英大文字、英小文字、数字を最低１つずつ使用してください。" />
                    )}
                </div>
                <div className={styles.form_input}>
                    <label>新しいパスワードの確認</label>
                    <Controller
                        name="password_confirmation"
                        control={control}
                        render={() => (
                            <TextField
                                type="password"
                                margin="dense"
                                fullWidth
                                {...register('password_confirmation', {
                                    required: true,
                                    validate: (value) => value === getValues('password'),
                                })}
                            />
                        )}
                    />{' '}
                    {errors.password_confirmation?.type === 'required' && (
                        <FormVaridateMessage message="確認用パスワードを入力してください。" />
                    )}
                    {errors.password_confirmation?.type === 'validate' && (
                        <FormVaridateMessage message="新しいパスワードが一致しません。" />
                    )}
                </div>
                <div className={styles.form_button_wrapper}>
                    <Button type="submit" value="変更" disabled={clicked} />
                </div>
            </form>
        </>
    );
};

export default PasswordChangeForm;
