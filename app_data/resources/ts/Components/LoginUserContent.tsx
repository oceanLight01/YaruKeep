import React from 'react';
import { useAuth } from './Authenticate';

type Props = {
    children: JSX.Element;
    userId: number;
};

const LoginUserContent = ({ children, userId }: Props) => {
    const auth = useAuth();

    return auth?.userData?.id === userId ? children : null;
};

export default LoginUserContent;
