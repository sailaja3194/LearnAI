const router = require('express').Router();
const auth = require('../middleware/auth');

const catalog = [
  { id: 'python-foundations', title: 'Python Foundations', category: 'Programming', level: 'Beginner', duration: '3 weeks', skills: ['Python basics', 'Functions', 'Problem solving'], description: 'Build confidence with Python fundamentals and small coding exercises.' },
  { id: 'web-development', title: 'Modern Web Development', category: 'Web Development', level: 'Beginner', duration: '4 weeks', skills: ['HTML', 'CSS', 'JavaScript', 'React'], description: 'Create responsive websites and interactive user interfaces.' },
  { id: 'ai-machine-learning', title: 'AI & Machine Learning', category: 'Artificial Intelligence', level: 'Intermediate', duration: '5 weeks', skills: ['AI concepts', 'Data', 'Model evaluation'], description: 'Understand machine learning concepts and practical AI use cases.' },
  { id: 'database-design', title: 'Database Essentials', category: 'Database', level: 'Beginner', duration: '2 weeks', skills: ['MongoDB', 'CRUD', 'Data modelling'], description: 'Learn how applications store, query and manage information.' }
];

router.get('/courses', auth, (req, res) => res.json(catalog));
router.get('/path', auth, (req, res) => {
  const interests = (req.user.interests || []).map(x => x.toLowerCase());
  const ordered = [...catalog].sort((a, b) => {
    const aMatch = interests.some(i => (a.category + a.title).toLowerCase().includes(i));
    const bMatch = interests.some(i => (b.category + b.title).toLowerCase().includes(i));
    return Number(bMatch) - Number(aMatch);
  });
  res.json({
    learnerLevel: req.user.skillLevel || 'Beginner',
    explanation: 'Your suggested path is ordered using the interests and skill level saved in your learner profile.',
    steps: ordered.map((course, index) => ({ order: index + 1, ...course, status: index === 0 ? 'Start here' : 'Recommended next' }))
  });
});
module.exports = router;
