import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './Authenticate';
import LogoutButton from './atoms/LogoutButton';

import styles from './../../scss/Navigation.modules.scss';

const Navigation = () => {
    const auth = useAuth();
    const [clicked, setClicked] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        setClicked(false);
    }, [location.key]);

    return auth?.userData === null ? (
        <nav>
            <ul className={styles.navigation_nologin}>
                <li className={styles.navigation_nologin_item}>
                    <Link to="/register">新規登録</Link>
                </li>
                <li className={styles.navigation_nologin_item}>
                    <Link to="/login">ログイン</Link>
                </li>
            </ul>
        </nav>
    ) : (
        <div className={styles.navigation_container}>
            <div className={styles.username} onClick={() => setClicked(!clicked)}>
                <span>{auth?.userData.name}</span>
            </div>

            <nav
                className={`${styles.navigation_content} ${
                    clicked ? styles.navigation_active : ''
                }`}
            >
                <ul>
                    <li className={styles.navigation_item}>
                        <Link to={`/user/${auth?.userData.screen_name}`}>マイページ</Link>
                    </li>
                    <li className={styles.navigation_item}>
                        <Link to="/post/habit">ハビットトラッカー作成</Link>
                    </li>
                    <li className={styles.navigation_item}>
                        <Link to="/settings">設定</Link>
                    </li>
                    <li className={styles.navigation_item}>
                        <LogoutButton />
                    </li>
                </ul>
            </nav>
            <div
                className={`${styles.navigation_inner} ${clicked ? styles.navigation_active : ''}`}
                onClick={() => setClicked(!clicked)}
            ></div>
        </div>
    );
};

export default Navigation;
