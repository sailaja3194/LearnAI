const router = require('express').Router();
const auth = require('../middleware/auth');
const { askAI } = require('../services/ai');

router.post('/tutor', auth, async (req, res) => {
  try {
    const question = (req.body.question || '').trim();
    if (!question) return res.status(400).json({ message: 'Enter a question first.' });
    const prompt = [
      { role: 'system', content: 'You are a friendly, accurate tutor. Explain concepts for a college student in simple steps, use a short example, and mention uncertainty when needed.' },
      { role: 'user', content: question }
    ];
    const live = await askAI(prompt);
    const answer = live || `Let's understand: ${question}\n\nStart by identifying the main concept, then break it into smaller steps. Try a small example and check each step. If you share your course topic or an example problem, I can guide you through it.\n\n(Demo tutor mode: add AI_API_KEY in backend/.env for live AI answers.)`;
    res.json({ answer, mode: live ? 'live-ai' : 'demo' });
  } catch (err) { res.status(502).json({ message: err.message }); }
});

router.post('/quiz', auth, async (req, res) => {
  try {
    const topic = (req.body.topic || 'General learning').trim();
    const level = req.body.level || 'Beginner';
    const prompt = [
      { role: 'system', content: 'Create exactly 5 multiple-choice learning questions. Return only valid JSON array. Each item: {"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}. answer is zero-based.' },
      { role: 'user', content: `Topic: ${topic}. Level: ${level}.` }
    ];
    const live = await askAI(prompt);
    if (live) {
      const cleaned = live.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      const questions = JSON.parse(cleaned);
      return res.json({ questions, mode: 'live-ai' });
    }
    res.json({ mode: 'demo', questions: [
      { question: `Which is the best first step when learning ${topic}?`, options: ['Memorize everything', 'Understand the basic concept', 'Skip examples', 'Avoid practice'], answer: 1, explanation: 'Understanding the fundamentals makes later topics easier.' },
      { question: 'What helps you check whether you understand a topic?', options: ['Practice questions', 'Only rereading', 'Skipping feedback', 'Guessing'], answer: 0, explanation: 'Practice reveals what you know and what needs review.' },
      { question: 'What should you do after making a mistake?', options: ['Stop learning', 'Ignore it', 'Review the reasoning', 'Delete your notes'], answer: 2, explanation: 'Reviewing mistakes helps you learn the correct approach.' },
      { question: 'Which is a useful learning habit?', options: ['Irregular study only', 'Short consistent practice', 'Never revise', 'Avoid questions'], answer: 1, explanation: 'Consistent practice builds long-term understanding.' },
      { question: 'How can you improve your learning plan?', options: ['Track progress', 'Avoid goals', 'Never reflect', 'Study without breaks'], answer: 0, explanation: 'Progress tracking helps identify strengths and gaps.' }
    ] });
  } catch (err) { res.status(502).json({ message: `Quiz generation failed: ${err.message}` }); }
});
module.exports = router;
