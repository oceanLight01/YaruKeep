import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMessage } from '../Components/FlashMessageContext';

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
        <>
            <h2>パスワードリセット</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {errors.password?.type === 'required' && <p>パスワードを入力してください。</p>}
                    {errors.password?.type === 'minLength' && (
                        <p>パスワードは８文字以上入力してください。</p>
                    )}
                    {errors.password?.type === 'maxLength' && (
                        <p>パスワードは64文字以下で入力してください。</p>
                    )}
                    {errors.password?.type === 'pattern' && (
                        <p>
                            パスワードは半角英大文字、英小文字、数字を最低１つずつ使用してください。
                        </p>
                    )}
                    <label>
                        新しいパスワード
                        <input
                            type="password"
                            autoComplete="off"
                            max={64}
                            {...register('password', {
                                required: true,
                                minLength: 8,
                                maxLength: 64,
                                pattern: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]+$/,
                            })}
                        />
                    </label>
                </div>
                <div>
                    {errors.password_confirmation?.type === 'required' && (
                        <p>確認用パスワードを入力してください。</p>
                    )}
                    {errors.password_confirmation?.type === 'validate' && (
                        <p>パスワードが一致しません。</p>
                    )}
                    <label>
                        パスワード確認
                        <input
                            type="password"
                            autoComplete="off"
                            max={64}
                            {...register('password_confirmation', {
                                required: true,
                                validate: (value) => value === getValues('password'),
                            })}
                        />
                    </label>
                </div>
                <input type="submit" value="送信" disabled={clicked} />
            </form>
        </>
    );
};

export default ResetPassword;
