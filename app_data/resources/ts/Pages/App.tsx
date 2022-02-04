import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Loading from './../Components/Loading';
import Top from './Top';
import Register from './Auth/Register';
import Login from './Auth/Login';
import EmailVerified from './Auth/EmailVerified';
import Home from './Home';
import ProvideAuth, {
    EmailVerifiedRoute,
    PrivateRoute,
    PublicRoute,
} from '../Components/Authenticate';

const App = () => {
    return (
        <ProvideAuth>
            <Loading>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PublicRoute>
                                    <Top />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/verified"
                            element={
                                <EmailVerifiedRoute>
                                    <EmailVerified />
                                </EmailVerifiedRoute>
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </Loading>
        </ProvideAuth>
    );
};

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
