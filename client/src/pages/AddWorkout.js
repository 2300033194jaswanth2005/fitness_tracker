import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import './AddWorkout.css';

const CATEGORIES = ['Cardio', 'Strength', 'Flexibility', 'Sports', 'Other'];

function AddWorkout() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', category: 'Cardio', duration: '', calories: '', notes: '', date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/api/workouts', form, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-workout-page">
      <div className="add-workout-card">
        <div className="add-workout-header">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>← Back</button>
          <h2>Log Workout</h2>
        </div>
        {error && <div className="workout-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Workout Title *</label>
              <input name="title" placeholder="e.g. Morning Run" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input name="duration" type="number" min="1" placeholder="30" value={form.duration} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Calories Burned</label>
              <input name="calories" type="number" min="0" placeholder="250" value={form.calories} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" placeholder="How did it go?" value={form.notes} onChange={handleChange} rows={3} />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Workout'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddWorkout;
