// src/Login.js

import React, { useState } from 'react';
import users from './users';
import {Checkbox, Input} from "antd";
import {Button, Form} from "react-bootstrap";

function Login({ setUser, setIsUserImported }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        const user = users.find((user) => user.username === username && user.password === password);

        if (user) {
            setUser(user);
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}

                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleLogin}>Login</button>
            </div>
            {error && <p>{error}</p>}
        </div>


    );
}

export default Login;