import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle User Login
    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError('');

            const response = await fetch(
                'http://localhost:5000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            // Debugging
            console.log('Login Status:', response.status);
            console.log('Login Response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Check JWT Token
            if (!data.token || !data.user) {
                throw new Error('Authentication token or user details missing.');
            }

            // Save Authentication Details
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            console.log('Token Saved:', !!localStorage.getItem('token'));
            console.log('Logged In User:', data.user);

            // Redirect to Dashboard
            window.location.href = '/';

        } catch (error) {

            console.error('Login Error:', error);
            setError(error.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-container">

            <div className="login-box">

                <h1>Enterprise CRM</h1>

                <p className="login-subtitle">
                    Login to your account
                </p>

                <form onSubmit={handleLogin} autoComplete="off">

                    {/* Email Address */}
                    <div className="login-input">

                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            required
                        />

                    </div>

                    {/* Password */}
                    <div className="login-input">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />

                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    {/* Login Button */}
                    <button type="submit" disabled={loading}>

                        {loading ? 'Logging in...' : 'Login'}

                    </button>

                </form>

                {/* Registration Link */}
                <p style={{ textAlign: 'center', marginTop: '20px' }}>

                    Don't have an account?
                    {' '}
                    <Link to="/register">Register Here</Link>

                </p>

            </div>

        </div>

    );

}

export default Login;