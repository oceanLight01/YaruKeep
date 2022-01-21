import React from 'react';
import { Link } from 'react-router-dom';

const Top = () => {
    return (
        <>
            <h1>Top Page</h1>
            <Link to="register">アカウント登録ページ</Link>
            <Link to="login">ログインページ</Link>
        </>
    );
};

export default Top;
