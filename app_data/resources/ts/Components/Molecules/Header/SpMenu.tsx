import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Authenticate';

import styles from 'scss/Components/Molecules/Header/SpMenu.modules.scss';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import LogoutButton from '../../Atoms/Buttons/LogoutButton';

const SpMenu = () => {
    const auth = useAuth();
    const location = useRef(window.location.pathname);

    const [open, setOpen] = useState<boolean>(false);
    let body = document.body;
    const menuOpenClass = styles.menu_open;

    function toggleMenu() {
        if (!open) {
            body.classList.add(menuOpenClass);
            body.style.top = `-${window.scrollY}px`;
            body.style.position = 'fixed';
        } else {
            const scrolly = body.style.top;
            body.style.position = '';
            body.style.top = '';

            if (location.current === window.location.pathname) {
                window.scroll({
                    top: parseInt(scrolly || '0') * -1,
                });
            } else {
                window.scrollTo(0, 0);
                location.current = window.location.pathname;
            }

            body.classList.remove(menuOpenClass);
        }
        setOpen(!open);
    }

    return auth?.userData ? (
        <div className={styles.sp_container}>
            <div className={`${styles.sp_icon_wrapper} ${open && styles.open_icon}`}>
                <IconButton size="large" color="inherit" onClick={toggleMenu}>
                    <MenuIcon />
                </IconButton>
            </div>
            <div
                className={`${styles.sp_navigation_background} ${open && styles.active}`}
                onClick={toggleMenu}
            ></div>
            <nav>
                <ul
                    className={`${styles.sp_navigation} ${open && styles.open}`}
                    onClick={toggleMenu}
                >
                    <li className={styles.menu_item}>
                        <div className={styles.login_user_container}>
                            <div className={styles.user_avatar}>
                                <Avatar
                                    alt={auth?.userData?.name}
                                    src={`/storage/profiles/${auth?.userData?.profile_image}`}
                                />
                            </div>
                            <div className={styles.login_user_info}>
                                <div className={styles.login}>ログイン中</div>
                                <div className={styles.login_user_name}>{auth?.userData?.name}</div>
                            </div>
                        </div>
                    </li>
                    <li className={styles.menu_item}>
                        <Link to={`/user/${auth?.userData?.screen_name}`}>マイページ</Link>
                    </li>
                    <li className={styles.menu_item}>
                        <Link to="/post/habit">ハビットトラッカー作成</Link>
                    </li>
                    <li className={styles.menu_item}>
                        <Link to="/search">検索</Link>
                    </li>
                    <li className={styles.menu_item}>
                        <Link to="/settings">設定</Link>
                    </li>
                    <li className={styles.menu_item}>
                        <LogoutButton />
                    </li>
                </ul>
            </nav>
        </div>
    ) : (
        <nav>
            <ul className={styles.sp_root_navigation}>
                <li className={styles.nav_item}>
                    <Link to="/register">新規登録</Link>
                </li>
                <li className={styles.nav_item}>
                    <Link to="/login">ログイン</Link>
                </li>
            </ul>
        </nav>
    );
};

export default SpMenu;
