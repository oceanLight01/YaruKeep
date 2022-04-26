import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Authenticate';

import styles from '../../scss/Header.modules.scss';

const Header = () => {
    const auth = useAuth();

    return (
        <header className={styles.header}>
            <Link to="/">Yarukeep</Link>
            <p>{auth?.userData?.name}</p>
        </header>
    );
};

export default Header;
