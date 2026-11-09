import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {

const navigate = useNavigate();

// Form States
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// UI States
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [loading, setLoading] = useState(false);

// Handle User Registration
const handleRegister = async (e) => {

    e.preventDefault();

    setError('');
    setSuccess('');

    // Name Validation
    if (!name.trim()) {
        setError('Please enter your full name.');
        return;
    }

    // Email Validation
    if (!email.trim()) {
        setError('Please enter your email address.');
        return;
    }

    // Password Validation
    if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
    }

    try {

        setLoading(true);

        const response = await fetch(
            'http://localhost:5000/api/auth/register',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password
                })
            }
        );

        const data = await response.json();

        // Debugging Information
        console.log('Register Status:', response.status);
        console.log('Register Response:', data);

        if (!response.ok) {

            throw new Error(
                data.message || `Registration failed (${response.status})`
            );

        }

        // Registration Successful
        setSuccess('Registration successful! Please login.');

        setName('');
        setEmail('');
        setPassword('');
        setShowPassword(false);

        // Redirect to Login
        setTimeout(() => {
            navigate('/login');
        }, 1500);

    } catch (error) {

        console.error('Registration Error:', error);

        if (error.message === 'Failed to fetch') {

            setError(
                'Server connection failed. Please check your internet or backend server.'
            );

        } else {

            setError(
                error.message || 'Registration failed. Please try again.'
            );

        }

    } finally {

        setLoading(false);

    }

};

return (

    <div className="register-container">

        <div className="register-box">

            <h1>Enterprise CRM</h1>

            <p className="register-subtitle">
                Create your Employee Account
            </p>

            <form onSubmit={handleRegister} autoComplete="off">

                {/* Full Name */}
                <div className="register-input">

                    <label>Full Name</label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="off"
                        required
                    />

                </div>


                {/* Email Address */}
                <div className="register-input">

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
                <div className="register-input">

                    <label>Password</label>

                    <div className="password-wrapper">

                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password (minimum 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>

                    </div>

                </div>


                {/* Error Message */}
                {error && (

                    <p className="register-error" role="alert">
                        {error}
                    </p>

                )}


                {/* Success Message */}
                {success && (

                    <p className="register-success" role="status">
                        {success}
                    </p>

                )}


                {/* Register Button */}
                <button type="submit" disabled={loading}>

                    {loading ? 'Creating Account...' : 'Register'}

                </button>

            </form>


            {/* Login Link */}
            <p className="register-login">

                Already have an account? <Link to="/login">Login</Link>

            </p>

        </div>

    </div>

);

}

export default Register;