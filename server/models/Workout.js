const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true },
  category: { type: String, enum: ['Cardio', 'Strength', 'Flexibility', 'Sports', 'Other'], default: 'Other' },
  duration: { type: Number, required: true },   // minutes
  calories: { type: Number, default: 0 },
  notes:    { type: String, default: '' },
  date:     { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
