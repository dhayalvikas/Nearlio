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
    <nav className="bg-cream border-b border-ink/10 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-display text-2xl font-semibold text-ink">
        Near<span className="text-terracotta">lio</span>
      </Link>

      <div className="flex items-center gap-6 font-body text-sm">
        {user ? (
          <>
            {user.role === 'CUSTOMER' && (
              <>
                <Link to="/" className="text-ink/70 hover:text-ink transition">Browse</Link>
                <Link to="/my-bookings" className="text-ink/70 hover:text-ink transition">My Bookings</Link>
                <Link to="/favorites" className="text-ink/70 hover:text-ink transition">Favorites</Link>
              </>
            )}

            {user.role === 'VENDOR' && (
              <>
                <Link to="/vendor/dashboard" className="text-ink/70 hover:text-ink transition">Dashboard</Link>
                <Link to="/vendor/bookings" className="text-ink/70 hover:text-ink transition">Bookings</Link>
                <Link to="/vendor/stats" className="text-ink/70 hover:text-ink transition">Stats</Link>
              </>
            )}

            {user.role === 'ADMIN' && (
              <Link to="/admin" className="text-ink/70 hover:text-ink transition">Admin</Link>
            )}

            <span className="text-ink/40">|</span>

            <span className="text-ink/70">
              {user.name} <span className="font-mono text-xs text-terracotta">({user.role})</span>
            </span>

            <button
              onClick={handleLogout}
              className="text-sindoor hover:text-sindoor/70 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-ink/70 hover:text-ink transition">Login</Link>
            <Link
              to="/register"
              className="bg-ink text-cream px-4 py-2 rounded hover:bg-ink/90 transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}