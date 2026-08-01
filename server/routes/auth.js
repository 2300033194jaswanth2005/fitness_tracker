const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email format' });

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  if (name.trim().length < 2)
    return res.status(400).json({ message: 'Name must be at least 2 characters' });

  try {
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed });
    res.status(201).json({ message: 'Registered successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    // Always compare to prevent timing attacks
    const dummyHash = '$2a$12$invalidhashfortimingprotection000000000000000000000000';
    const match = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, dummyHash);

    if (!user || !match)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, name: user.name });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
