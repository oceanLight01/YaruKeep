import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from './Authenticate';
import { useMessage } from './FlashMessageContext';

import styles from './../../scss/SettingsForm.modules.scss';
import TextField from '@mui/material/TextField';
import FormVaridateMessage from './atoms/FormVaridateMessage';
import Button from './atoms/Button';
import ValidateCountInput from './ValidateCountInput';

type EmailChangeForm = {
    email: string;
};

const EmailChangeForm = () => {
    const auth = useAuth();
    const flashMessage = useMessage();
    const [clicked, setClicked] = useState<boolean>(false);
    const [formStatus, setFormStatus] = useState({ error: '' });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
    } = useForm<EmailChangeForm>({ mode: 'onBlur' });

    let unmounted = false;
    useEffect(() => {
        return () => {
            unmounted = true;
        };
    }, []);

    const onSubmit: SubmitHandler<EmailChangeForm> = (data) => {
        setClicked(true);

        const postData = {
            ...data,
            user_id: auth?.userData?.id,
        };

        axios
            .post('/api/email/change', postData)
            .then(() => {
                if (!unmounted) {
                    flashMessage?.setMessage('確認用メッセージを送信しました。');
                }
            })
            .catch((error) => {
                if (!unmounted) {
                    if (error.response.status >= 500) {
                        flashMessage?.setErrorMessage('', error.response.status);
                    } else {
                        setFormStatus({
                            ...formStatus,
                            error: error.response.data.errors.email,
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
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.form_input}>
                    <div className={styles.form_label}>
                        <label>新しいメールアドレス</label>
                        <ValidateCountInput text={watch('email')} limit={255} />
                    </div>
                    <Controller
                        name="email"
                        control={control}
                        render={() => (
                            <TextField
                                type="email"
                                margin="dense"
                                fullWidth
                                {...register('email', {
                                    required: true,
                                    maxLength: 255,
                                    pattern:
                                        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                })}
                            />
                        )}
                    />
                    {formStatus.error.length > 0 && <p>{formStatus.error}</p>}
                    {errors.email?.type === 'required' && (
                        <FormVaridateMessage message="メールアドレスを入力してください。" />
                    )}
                    {errors.email?.type === 'maxLength' && (
                        <FormVaridateMessage message="メールアドレスは255文字以下で入力してください。" />
                    )}
                    {errors.email?.type === 'pattern' && (
                        <FormVaridateMessage message="正しい形式のメールアドレスを入力してください。" />
                    )}
                </div>
                <div className={styles.form_button_wrapper}>
                    <Button type="submit" value="送信" disabled={clicked} />
                </div>
            </form>
        </>
    );
};

export default EmailChangeForm;
