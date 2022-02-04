import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Authenticate';

const Header = () => {
    const auth = useAuth();

    return (
        <header>
            <Link to="/">Yarukeep</Link>
            <p>{auth?.userData?.name}</p>
        </header>
    );
};

export default Header;
