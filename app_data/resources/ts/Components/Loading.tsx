import React from 'react';
import { useAuth } from './Authenticate';

type Props = {
    children: React.ReactNode;
};

const Loading = ({ children }: Props) => {
    const auth = useAuth();

    return <div>{auth?.isRender ? children : <p>Loading...</p>}</div>;
};

export default Loading;
