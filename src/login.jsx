import { useState } from 'react';
import './login.css';

const VALID_USERNAME = 'hollisterinn';
const VALID_PASSWORD = 'admin123';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            setError('');
            onLogin();
            return;
        }

        setError('Invalid username or password.');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                   
                    <h1>Welcome Back</h1>
                    <p>Login in to your dashboard</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
