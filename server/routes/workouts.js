const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all workouts for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a workout
router.post('/', auth, async (req, res) => {
  const { title, category, duration, calories, notes, date } = req.body;
  if (!title || !duration)
    return res.status(400).json({ message: 'Title and duration are required' });

  try {
    const workout = await Workout.create({ user: req.user.id, title, category, duration, calories, notes, date });
    res.status(201).json(workout);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await workout.deleteOne();
    res.json({ message: 'Workout deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stats summary
router.get('/stats', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id });
    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const categoryCount = workouts.reduce((acc, w) => {
      acc[w.category] = (acc[w.category] || 0) + 1;
      return acc;
    }, {});
    res.json({ totalWorkouts, totalMinutes, totalCalories, categoryCount });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
