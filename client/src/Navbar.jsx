function Navbar() {

    // Get logged-in user details
    let user = {};

    try {
        user = JSON.parse(localStorage.getItem('user')) || {};
    } catch (error) {
        user = {};
    }

    // Handle Logout
    const handleLogout = () => {

        // Remove authentication details
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to Login page and reload application
        window.location.href = '/login';
    };

    return (

        <header className="topbar">

            {/* Dashboard Heading */}
            <div>
                <h2>Dashboard</h2>
                <p>Welcome back, {user.name || 'User'}!</p>
            </div>

            {/* User Profile */}
            <div className="admin-profile">

                <span>👤</span>

                <div>
                    <h4>{user.name || 'User'}</h4>
                    <small>{user.role || 'Employee'}</small>
                </div>

                {/* Logout Button */}
                <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </header>

    );
}

export default Navbar;