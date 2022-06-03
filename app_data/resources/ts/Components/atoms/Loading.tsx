import React from 'react';
import Circular from './Circular';
import { useAuth } from '../Authenticate';

import styles from 'scss/Components/Atoms/Loading.modules.scss';

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
