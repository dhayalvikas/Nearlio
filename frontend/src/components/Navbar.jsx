import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Nearlio
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">
              {user.name} <span className="text-gray-400">({user.role})</span>
            </span>

            {user.role === 'CUSTOMER' && (
              <>
                <Link to="/" className="text-sm hover:text-blue-600">
                  Browse
                </Link>
                <Link to="/my-bookings" className="text-sm hover:text-blue-600">
                  My Bookings
                </Link>
                <Link to="/favorites" className="text-sm hover:text-blue-600">
                  Favorites
                </Link>
              </>
            )}

            {user.role === 'VENDOR' && (
              <>
                <Link to="/vendor/dashboard" className="text-sm hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/vendor/bookings" className="text-sm hover:text-blue-600">
                  Bookings
                </Link>
              </>
            )}

            {user.role === 'ADMIN' && (
              <Link to="/admin" className="text-sm hover:text-blue-600">
                Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-sm hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}