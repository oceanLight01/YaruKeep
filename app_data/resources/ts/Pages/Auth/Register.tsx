import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <>
            <h1>アカウント登録</h1>
            <Link to="/login">ログインページ</Link>
        </>
    );
};

export default Register;
