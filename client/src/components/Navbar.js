import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate(auth ? '/dashboard' : '/')}>
        💪 FitnessTracker
      </div>
      <div className="navbar-links">
        {auth ? (
          <>
            <span className="navbar-user">Hi, {auth.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="btn-nav" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-nav btn-primary" onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
