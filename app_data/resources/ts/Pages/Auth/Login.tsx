import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';

type LoginForm = {
    email: string;
    password: string;
    rememberMe: boolean;
};

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({ mode: 'onBlur' });
    const onSubmit: SubmitHandler<LoginForm> = (data) => console.log(data);

    return (
        <>
            <h1>ログイン</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {errors.email && <p>メールアドレスを入力してください。</p>}
                    <label>メールアドレス</label>
                    <input {...register('email', { required: true })} />
                </div>
                <div>
                    {errors.password && <p>パスワードを入力してください。</p>}
                    <label>パスワード</label>
                    <input {...register('password', { required: true })} />
                </div>
                <div>
                    <label>ログイン状態を保存する</label>
                    <input type="checkbox" {...register('rememberMe', {})} />
                </div>
                <input type="submit" value="ログイン" />
            </form>
            <Link to="/register">登録ページ</Link>
        </>
    );
};

export default Login;
