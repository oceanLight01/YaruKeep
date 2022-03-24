import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Components/Authenticate';

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
    const auth = useAuth();

    const onSubmit: SubmitHandler<LoginForm> = (data) => {
        setIsLoading(true);

        axios
            .get('/sanctum/scrf-cookie')
            .then(() => {
                auth?.login(data)
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
                    <input type="email" {...register('email', { required: true })} />
                </div>
                <div>
                    {errors.password && <p>パスワードを入力してください。</p>}
                    <label>パスワード</label>
                    <input type="password" {...register('password', { required: true })} />
                </div>
                <div>
                    <label>ログイン状態を保存する</label>
                    <input type="checkbox" {...register('remember', {})} />
                </div>
                <input type="submit" value="ログイン" disabled={isLoading} />
            </form>
            <div>
                <Link to="/register">登録ページ</Link>
            </div>
            <div>
                <Link to="/password/forgot">パスワードを忘れた</Link>
            </div>
        </>
    );
};

export default Login;
