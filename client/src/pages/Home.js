import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Track Your <span>Fitness Journey</span></h1>
        <p>Log workouts, monitor progress, and crush your goals — all in one place.</p>
        <div className="home-actions">
          {auth ? (
            <button className="btn-hero" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          ) : (
            <>
              <button className="btn-hero" onClick={() => navigate('/register')}>Get Started Free</button>
              <button className="btn-hero btn-outline" onClick={() => navigate('/login')}>Login</button>
            </>
          )}
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <span>🏋️</span>
          <h3>Log Workouts</h3>
          <p>Track every session with category, duration, and calories burned.</p>
        </div>
        <div className="feature-card">
          <span>📊</span>
          <h3>View Stats</h3>
          <p>See your total workouts, minutes trained, and calories burned at a glance.</p>
        </div>
        <div className="feature-card">
          <span>🎯</span>
          <h3>Stay Consistent</h3>
          <p>Build habits by keeping a complete history of your fitness activity.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
