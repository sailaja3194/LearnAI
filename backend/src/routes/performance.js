const router = require('express').Router();
const auth = require('../middleware/auth');
const QuizResult = require('../models/QuizResult');

router.get('/', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    const totalAttempts = results.length;
    const average = totalAttempts ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts) : 0;
    res.json({ totalAttempts, averageScore: average, recentResults: results });
  } catch (err) { res.status(500).json({ message: 'Could not load performance.', error: err.message }); }
});

router.post('/quiz-result', auth, async (req, res) => {
  try {
    const { topic, score, total } = req.body;
    if (!Number.isFinite(score) || !Number.isFinite(total) || total < 1 || score < 0 || score > total) {
      return res.status(400).json({ message: 'Provide a valid score and total.' });
    }
    const result = await QuizResult.create({ user: req.user.id, topic: topic || 'General', score, total, percentage: Math.round(score / total * 100) });
    res.status(201).json({ result });
  } catch (err) { res.status(500).json({ message: 'Could not save quiz result.', error: err.message }); }
});
module.exports = router;
