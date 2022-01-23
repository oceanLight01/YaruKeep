import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

const Login = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({ mode: 'onBlur' });
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<LoginForm> = (data) => {
        setIsLoading(true);

        axios
            .get('/sanctum/scrf-cookie')
            .then(() => {
                axios
                    .post('/api/login', data)
                    .then(() => {
                        navigate('/home');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

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
                    <input type="checkbox" {...register('remember', {})} />
                </div>
                <input type="submit" value="ログイン" disabled={isLoading} />
            </form>
            <Link to="/register">登録ページ</Link>
        </>
    );
};

export default Login;
