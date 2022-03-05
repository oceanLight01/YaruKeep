import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';

type UserData = {
    id: number;
    name: string;
    screen_name: string;
    email: string;
    email_verified_at: string | null;
    profile: string;
    profile_image: string;
    following_count: number;
    followed_count: number;
    created_at: string;
    updated_at: string;
};

type RegisterData = {
    name: string;
    screen_name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type LoginData = {
    email: string;
    password: string;
    remember: boolean;
};

type EditData = {
    name: string;
    screen_name: string;
    email: string;
    profile: string;
};

type Route = {
    children: JSX.Element;
};

type AuthProps = {
    userData: UserData | null;
    isRender: boolean;
    getUser: () => void;
    register: (registerData: RegisterData) => Promise<void>;
    login: (loginData: LoginData) => Promise<void>;
    logout: () => Promise<void>;
    edit: (editData: EditData) => Promise<any | void>;
};

type Props = {
    children: JSX.Element;
};

/**
 * 認証に関するコンテキストフック
 */
const AuthContext = createContext<AuthProps | null>(null);
export const useAuth = () => {
    return useContext(AuthContext);
};

const ProvideAuth = ({ children }: Props) => {
    const auth = useProvideAuth();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
export default ProvideAuth;

const useProvideAuth = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isRender, setIsRender] = useState<boolean>(false);

    const getUser = () => {
        axios
            .get('/api/user')
            .then((res) => {
                setUserData(res.data.data.user);
            })
            .catch((error) => {
                setUserData(null);
                console.error(error);
            })
            .finally(() => {
                setIsRender(true);
            });
    };

    const register = (registerData: RegisterData) => {
        return axios
            .post('/api/register', registerData)
            .then(() => {
                setIsRender(false);
                getUser();
            })
            .catch((error) => {
                return Promise.reject(error.response.data.errors);
            });
    };

    const login = async (loginData: LoginData) => {
        await axios.post('/api/login', loginData).catch((error) => console.log(error));

        return axios
            .get('/api/user')
            .then((res) => {
                setUserData(res.data.data.user);
            })
            .catch((error) => {
                setUserData(null);
                console.error(error);
            });
    };

    const logout = () => {
        return axios
            .post('/api/logout')
            .then(() => {
                setUserData(null);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const edit = async (editData: EditData) => {
        const update = await axios
            .put('/api/user/profile-information', editData)
            .then(() => {
                return Promise.resolve();
            })
            .catch((error) => {
                return error.response.data.errors;
            });

        const getUser = await axios
            .get('/api/user')
            .then((res) => {
                setUserData(res.data.data.user);
            })
            .catch((error) => {
                console.error(error);
            });

        return Promise.all([update, getUser]);
    };

    useEffect(() => {
        getUser();
    }, []);

    return {
        getUser,
        register,
        login,
        logout,
        edit,
        userData,
        isRender,
    };
};

/**
 * ユーザが認証されている状態のときのみに表示するコンポーネントを返す
 * 認証されていなければ/loginへリダイレクトする
 *
 * @param {JSX.Element} children 認証状態のときに表示する子コンポーネント
 * @returns {(JSX.Element | Navigate)}
 */
export const PrivateRoute = ({ children }: Route) => {
    const auth = useAuth();
    const emailVerified =
        auth?.userData?.email_verified_at === null ? <Navigate to="/verified" replace /> : children;
    return auth?.userData === null ? <Navigate to="/login" replace /> : emailVerified;
};

/**
 * ユーザがメール認証が未完了時に/verifiedへリダイレクトする
 * メール認証が完了している際は/verifiedにアクセスすると/homeへリダイレクトする
 *
 * @param {JSX.Element} children メール認証が未完了時に表示する子コンポーネント
 * @returns {(JSX.Element | Navigate)}
 */
export const EmailVerifiedRoute = ({ children }: Route) => {
    const auth = useAuth();
    return auth?.userData?.email_verified_at === null ? children : <Navigate to="/home" replace />;
};

/**
 * ユーザが認証されていない状態のときのみに表示するコンポーネントを返す
 * 認証されていれば/homeへリダイレクトする
 *
 * @param children 非認証状態のときに表示する子コンポーネント
 * @returns {(JSX.Element | Navigate)}
 */
export const PublicRoute = ({ children }: Route) => {
    const auth = useAuth();
    return auth?.userData === null ? children : <Navigate to="/home" replace />;
};
