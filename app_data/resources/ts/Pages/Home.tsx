import React from 'react';
import Paginate from '../Components/atoms/Paginate';
import TopPageHabit from '../Components/TopPageHabit';

import styles from './../../scss/Home.modules.scss';

const Home = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <TopPageHabit />
            </div>
        </div>
    );
};

export default Home;
