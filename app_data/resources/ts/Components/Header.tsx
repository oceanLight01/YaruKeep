import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Authenticate';

import styles from 'scss/Components/Header.modules.scss';
import NavigationNotification from './Atoms/NavigationNotification';
import SearchIcon from '@mui/icons-material/Search';
import Navigation from './Molecules/Header/Navigation';
import SpMenu from './Molecules/Header/SpMenu';

const Header = () => {
    const auth = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.header_wrapper}>
                <div className={styles.header_logo_wrapper}>
                    <Link to="/" className={styles.header_logo}>
                        Yarukeep
                    </Link>
                </div>
                <div className={styles.header_menu_wrapper}>
                    {auth?.userData && (
                        <>
                            <div className={styles.header_search}>
                                <Link to={'/search'}>
                                    <SearchIcon />
                                    <span>検索</span>
                                </Link>
                            </div>
                            <div className={styles.header_notification}>
                                <NavigationNotification />
                            </div>
                        </>
                    )}

                    <div className={styles.header_user_name}>
                        <Navigation />
                    </div>
                    <SpMenu />
                </div>
            </div>
        </header>
    );
};

export default Header;
