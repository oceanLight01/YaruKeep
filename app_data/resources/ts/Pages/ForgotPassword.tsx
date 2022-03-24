import axios from 'axios';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type ForgotPasswordForm = {
    email: string;
};

const ForgotPassword = () => {
    const [clicked, setClicked] = useState<boolean>(false);
    const [formStatus, setFormStatus] = useState({ success: false, error: '' });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({ mode: 'onBlur' });

    const onSubmit: SubmitHandler<ForgotPasswordForm> = (data) => {
        setClicked(true);
        setFormStatus({
            ...formStatus,
            error: '',
        });

        axios
            .post('/api/forgot-password', data)
            .then(() => {
                setFormStatus({
                    ...formStatus,
                    success: true,
                    error: '',
                });
            })
            .catch((error) => {
                setFormStatus({
                    ...formStatus,
                    success: false,
                    error: error.response.data.errors.email[0],
                });
            })
            .finally(() => {
                setClicked(false);
            });
    };

    return (
        <>
            <h2>パスワードリセット</h2>
            {formStatus.success && <p>パスワードリセット用のメールを送信しました。</p>}
            {formStatus.error.length > 0 && <p>{formStatus.error}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {errors.email?.type === 'required' && <p>メールアドレスを入力してください。</p>}
                    <label>
                        メールアドレス
                        <input
                            type="email"
                            autoComplete="off"
                            max={255}
                            {...register('email', { required: true })}
                        />
                    </label>
                </div>
                <input type="submit" value="送信" disabled={clicked} />
            </form>
        </>
    );
};

export default ForgotPassword;
