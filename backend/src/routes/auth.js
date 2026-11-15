const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

function tokenFor(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
function safeUser(user) {
  return { id: user._id, name: user.name, email: user.email, interests: user.interests, skillLevel: user.skillLevel };
}

router.post('/register', async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Set JWT_SECRET in backend/.env first.' });
    const { name, email, password, interests, skillLevel } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, valid email and password (at least 6 characters) are required.' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: normalizedEmail, password: hashed, interests: interests || ['Programming'], skillLevel: skillLevel || 'Beginner' });
    res.status(201).json({ token: tokenFor(user), user: safeUser(user) });
  } catch (err) { res.status(500).json({ message: 'Could not create account.', error: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Set JWT_SECRET in backend/.env first.' });
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Incorrect email or password.' });
    res.json({ token: tokenFor(user), user: safeUser(user) });
  } catch (err) { res.status(500).json({ message: 'Could not sign in.', error: err.message }); }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ user: safeUser(user) });
});
module.exports = router;
