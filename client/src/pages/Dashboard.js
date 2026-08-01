import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${auth.token}` };

  const fetchData = useCallback(async () => {
    try {
      const [wRes, sRes] = await Promise.all([
        API.get('/api/workouts', { headers }),
        API.get('/api/workouts/stats', { headers }),
      ]);
      setWorkouts(wRes.data);
      setStats(sRes.data);
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/workouts/${id}`, { headers });
      setWorkouts(prev => prev.filter(w => w._id !== id));
      setStats(prev => ({
        ...prev,
        totalWorkouts: prev.totalWorkouts - 1,
      }));
    } catch {
      alert('Failed to delete workout');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button className="btn-add" onClick={() => navigate('/add-workout')}>+ Add Workout</button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🏋️</span>
            <div>
              <p className="stat-value">{stats.totalWorkouts}</p>
              <p className="stat-label">Total Workouts</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏱️</span>
            <div>
              <p className="stat-value">{stats.totalMinutes}</p>
              <p className="stat-label">Minutes Trained</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div>
              <p className="stat-value">{stats.totalCalories}</p>
              <p className="stat-label">Calories Burned</p>
            </div>
          </div>
        </div>
      )}

      <div className="workout-section">
        <h3>Recent Workouts</h3>
        {workouts.length === 0 ? (
          <div className="empty-state">
            <p>No workouts yet. <span onClick={() => navigate('/add-workout')}>Add your first one!</span></p>
          </div>
        ) : (
          <div className="workout-list">
            {workouts.map(w => (
              <div key={w._id} className="workout-card">
                <div className="workout-info">
                  <span className={`category-badge cat-${w.category.toLowerCase()}`}>{w.category}</span>
                  <h4>{w.title}</h4>
                  <p>{w.duration} min {w.calories > 0 && `· ${w.calories} kcal`} {w.notes && `· ${w.notes}`}</p>
                  <small>{new Date(w.date).toLocaleDateString()}</small>
                </div>
                <button className="btn-delete" onClick={() => handleDelete(w._id)}>🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
