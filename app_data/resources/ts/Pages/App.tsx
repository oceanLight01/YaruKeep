import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Top from './Top';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Home from './Home';
import { PrivateRoute, PublicRoute } from '../Components/Authenticate';

const App = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
        axios
            .get('/api/user')
            .then((res) => {
                if (res.data.isLogin) {
                    setIsLogin(true);
                } else {
                    setIsLogin(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PublicRoute auth={isLogin}>
                                <Top />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute auth={isLogin}>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute auth={isLogin}>
                                <Register />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/home"
                        element={
                            <PrivateRoute auth={isLogin}>
                                <Home />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
