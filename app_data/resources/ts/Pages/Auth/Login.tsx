import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <>
            <h1>ログイン</h1>
            <Link to="/register">登録ページ</Link>
        </>
    );
};

export default Login;
