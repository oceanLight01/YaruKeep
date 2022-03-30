import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from './Authenticate';
import { useMessage } from './FlashMessageContext';

type PasswordChangeForm = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

const PasswordChangeForm = () => {
    const auth = useAuth();
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
    } = useForm<PasswordChangeForm>();

    const onSubmit: SubmitHandler<PasswordChangeForm> = (data) => {
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
            });
    };

    return (
        <>
            <div>
                {formStatus.errors.curren_password.length > 0 && (
                    <p>{formStatus.errors.curren_password}</p>
                )}
                {formStatus.errors.password.length > 0 && <p>{formStatus.errors.password}</p>}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {errors.current_password?.type === 'required' && (
                        <p>パスワードを入力してください。</p>
                    )}
                    <label>
                        現在のパスワード
                        <input
                            type="password"
                            maxLength={64}
                            autoComplete="off"
                            {...register('current_password', {
                                required: true,
                            })}
                        />
                    </label>
                </div>
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
                            maxLength={64}
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
                        <p>新しいパスワードが一致しません。</p>
                    )}
                    <label>
                        新しいパスワードの確認
                        <input
                            type="password"
                            autoComplete="off"
                            maxLength={64}
                            {...register('password_confirmation', {
                                required: true,
                                validate: (value) => value === getValues('password'),
                            })}
                        />
                    </label>
                </div>
                <input type="submit" value="変更" />
            </form>
        </>
    );
};

export default PasswordChangeForm;
