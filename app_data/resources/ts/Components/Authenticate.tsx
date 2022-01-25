import React from 'react';
import { Route, Navigate } from 'react-router-dom';

type Route = {
    children: JSX.Element;
    auth: boolean;
};

/**
 * ユーザが認証されている状態のときのみに表示するコンポーネントを返す
 * 認証されていなければ/loginへリダイレクトする
 *
 * @param {JSX.Element}children 認証状態のときに表示する子コンポーネント
 * @param {boolean} auth 認証状態の真偽値
 */
export const PrivateRoute = ({ children, auth }: Route) => {
    return auth ? children : <Navigate to="/login" replace />;
};

/**
 * ユーザが認証されていない状態のときのみに表示するコンポーネントを返す
 * 認証されていれば/homeへリダイレクトする
 *
 * @param children 認証されていないときに表示する子コンポーネント
 * @param {boolean} auth 認証状態の真偽値
 */
export const PublicRoute = ({ children, auth }: Route) => {
    return auth ? <Navigate to="/home" replace /> : children;
};
