import axios from 'axios';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from './Authenticate';

type EmailChangeForm = {
    email: string;
};

const EmailChangeForm = () => {
    const [clicked, setClicked] = useState<boolean>(false);
    const auth = useAuth();
    const [formStatus, setFormStatus] = useState({ success: false, error: '' });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailChangeForm>({ mode: 'onBlur' });

    const onSubmit: SubmitHandler<EmailChangeForm> = (data) => {
        setClicked(true);

        const postData = {
            ...data,
            user_id: auth?.userData?.id,
        };

        axios
            .post('/api/email/change', postData)
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
                    error: error.response.data.errors.email,
                });
            })
            .finally(() => {
                setClicked(false);
            });
    };

    return (
        <>
            {formStatus.success && <p>確認用メールを送信しました。</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {formStatus.error.length > 0 && <p>{formStatus.error}</p>}
                    {errors.email?.type === 'required' && <p>メールアドレスを入力してください。</p>}
                    {errors.email?.type === 'maxLength' && (
                        <p>メールアドレスは255文字以下で入力してください。</p>
                    )}
                    {errors.email?.type === 'pattern' && (
                        <p>正しい形式のメールアドレスを入力してください。</p>
                    )}
                    <label>
                        新しいメールアドレス
                        <input
                            type="email"
                            maxLength={255}
                            {...register('email', {
                                required: true,
                                maxLength: 255,
                                pattern:
                                    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                            })}
                        />
                    </label>
                </div>
                <input type="submit" value="送信" disabled={clicked} />
            </form>
        </>
    );
};

export default EmailChangeForm;
