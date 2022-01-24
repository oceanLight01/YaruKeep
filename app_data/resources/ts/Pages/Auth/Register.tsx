import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';

type RegisterForm = {
    name: string;
    screenName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
};

const Register = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<RegisterForm>({ mode: 'onBlur' });
    const onSubmit: SubmitHandler<RegisterForm> = (data) => console.log(data);

    return (
        <>
            <h1>アカウント登録</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {errors.name?.type === 'maxLength' && (
                        <p>アカウント名は30文字以下で入力してください。</p>
                    )}
                    {errors.name?.type === 'required' && <p>アカウント名を入力してください。</p>}
                    <label>アカウント名</label>
                    <input
                        type="text"
                        maxLength={30}
                        autoComplete="off"
                        {...register('name', { required: true, maxLength: 30 })}
                    />
                </div>
                <div>
                    {errors.screenName?.type === 'required' && (
                        <p>アカウントIDを入力してください。</p>
                    )}
                    {errors.screenName?.type === 'maxLength' && (
                        <p>アカウントIDは20文字以下で入力してください。</p>
                    )}
                    {errors.screenName?.type === 'pattern' && (
                        <p>アカウントIDは半角英数字のみ使用できます。</p>
                    )}
                    <label>アカウントID</label>
                    <input
                        type="text"
                        maxLength={20}
                        autoComplete="off"
                        {...register('screenName', {
                            required: true,
                            maxLength: 20,
                            pattern: /^(?=.*?[a-zA-Z\d])[a-zA-Z\d]+$/,
                        })}
                    />
                </div>
                <div>
                    {errors.email?.type === 'required' && <p>メールアドレスを入力してください。</p>}
                    {errors.email?.type === 'maxLength' && (
                        <p>メールアドレスは255文字以下で入力してください。</p>
                    )}
                    {errors.email?.type === 'pattern' && (
                        <p>正しい形式のメールアドレスを入力してください。</p>
                    )}
                    <label>メールアドレス</label>
                    <input
                        type="email"
                        maxLength={255}
                        autoComplete="on"
                        {...register('email', {
                            required: true,
                            maxLength: 255,
                            pattern:
                                /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                        })}
                    />
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

                    <label>パスワード</label>
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
                </div>

                <div>
                    {errors.passwordConfirmation?.type === 'required' && (
                        <p>確認用パスワードを入力してください。</p>
                    )}
                    {errors.passwordConfirmation?.type === 'validate' && (
                        <p>パスワードが一致しません。</p>
                    )}
                    <label>パスワード確認</label>
                    <input
                        type="password"
                        autoComplete="off"
                        maxLength={64}
                        {...register('passwordConfirmation', {
                            required: true,
                            validate: (value) => value === getValues('password'),
                        })}
                    />
                </div>
                <input type="submit" value="ログイン" disabled={isLoading} />
            </form>
            <Link to="/login">ログインページ</Link>
        </>
    );
};

export default Register;
