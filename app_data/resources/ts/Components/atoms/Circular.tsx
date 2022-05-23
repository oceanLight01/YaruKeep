import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import styles from './../../../scss/Circular.modules.scss';

const Circular = () => {
    return (
        <div className={styles.wrapper}>
            <CircularProgress />
        </div>
    );
};

export default Circular;
