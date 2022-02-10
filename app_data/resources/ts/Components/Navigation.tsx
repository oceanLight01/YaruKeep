import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Authenticate';

const Navigation = () => {
    const auth = useAuth();
    return auth?.userData === null ? (
        <nav>
            <ul>
                <li>
                    <Link to="/register">新規登録</Link>
                </li>
                <li>
                    <Link to="/login">ログイン</Link>
                </li>
            </ul>
        </nav>
    ) : (
        <nav>
            <ul>
                <li>
                    <Link to={`/user/${auth?.userData.screen_name}`}>マイページ</Link>
                </li>
                <li>
                    <Link to="/post/habit">ハビットトラッカー作成</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
