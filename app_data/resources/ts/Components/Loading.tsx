import React from 'react';
import Circular from './atoms/Circular';
import { useAuth } from './Authenticate';

import styles from './../../scss/Loading.modules.scss';

type Props = {
    children: React.ReactNode;
};

const Loading = ({ children }: Props) => {
    const auth = useAuth();

    return (
        <div>
            {auth?.isRender ? (
                children
            ) : (
                <div className={styles.container}>
                    <Circular />
                </div>
            )}
        </div>
    );
};

export default Loading;
