import { useEffect, useState } from 'react';
import { api, getToken } from './api';
import { Brain, BookOpen, Route, ClipboardList, ChartNoAxesColumnIncreasing, LogOut, Sparkles, Send, GraduationCap, Menu, X, CheckCircle2, Clock3, Target, LoaderCircle } from 'lucide-react';

const starterCourses = [
  { id: 'python', title: 'Python Foundations', category: 'Programming', level: 'Beginner', duration: '3 weeks', description: 'Build confidence with Python fundamentals, functions and problem solving.', skills: ['Python basics', 'Functions', 'Problem solving'] },
  { id: 'web', title: 'Modern Web Development', category: 'Web Development', level: 'Beginner', duration: '4 weeks', description: 'Create responsive websites and interactive interfaces with React.', skills: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { id: 'ai', title: 'AI & Machine Learning', category: 'Artificial Intelligence', level: 'Intermediate', duration: '5 weeks', description: 'Explore AI concepts, data and practical machine learning applications.', skills: ['AI concepts', 'Data', 'Model evaluation'] }
];

function App() {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [page, setPage] = useState('Dashboard');
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: 'Programming, Artificial Intelligence', skillLevel: 'Beginner' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [path, setPath] = useState([]);
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([{ role: 'assistant', text: 'Hi! I am your AI study tutor. Ask me to explain a concept, solve a doubt, or give you an example.' }]);
  const [topic, setTopic] = useState('Python programming');
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [performance, setPerformance] = useState({ totalAttempts: 0, averageScore: 0, recentResults: [] });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api('/auth/me').then(d => setUser(d.user)),
      api('/learning/path').then(d => setPath(d.steps || [])),
      api('/performance').then(setPerformance)
    ]).catch(err => { setError(err.message); if (err.message.includes('Session')) logout(); });
  }, [token]);

  async function submitAuth(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const payload = { ...form, interests: form.interests.split(',').map(x => x.trim()).filter(Boolean) };
      const data = await api(`/auth/${authMode}`, { method: 'POST', body: JSON.stringify(payload) });
      localStorage.setItem('learnai_token', data.token); setToken(data.token); setUser(data.user);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  function logout() { localStorage.removeItem('learnai_token'); setToken(null); setUser(null); setPage('Dashboard'); }
  async function askTutor(e) {
    e.preventDefault(); if (!question.trim()) return;
    const q = question; setQuestion(''); setChat(c => [...c, { role: 'user', text: q }]);
    try { const d = await api('/ai/tutor', { method: 'POST', body: JSON.stringify({ question: q }) }); setChat(c => [...c, { role: 'assistant', text: d.answer }]); }
    catch (err) { setChat(c => [...c, { role: 'assistant', text: `Sorry, ${err.message}` }]); }
  }
  async function generateQuiz() {
    setBusy(true); setError(''); setQuiz([]); setAnswers({}); setQuizDone(false);
    try { const d = await api('/ai/quiz', { method: 'POST', body: JSON.stringify({ topic, level: user?.skillLevel || 'Beginner' }) }); setQuiz(d.questions || []); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  async function submitQuiz() {
    const score = quiz.reduce((s, q, i) => s + (Number(answers[i]) === q.answer ? 1 : 0), 0);
    setQuizDone(true);
    try { const d = await api('/performance/quiz-result', { method: 'POST', body: JSON.stringify({ topic, score, total: quiz.length }) }); setPerformance(p => ({ ...p, totalAttempts: p.totalAttempts + 1, averageScore: Math.round((p.averageScore * p.totalAttempts + d.result.percentage) / (p.totalAttempts + 1)), recentResults: [d.result, ...p.recentResults] })); }
    catch (err) { setError(`Quiz scored, but result could not be saved: ${err.message}`); }
  }

  if (!token || !user) return <div className="auth-screen"><div className="auth-art"><div className="brand light"><span className="brand-mark"><Brain/></span> LearnAI</div><div className="auth-message"><span className="pill"><Sparkles size={14}/> PERSONALIZED LEARNING</span><h1>Your learning journey,<br/>powered by AI.</h1><p>Learn at your own pace. Ask questions, practice smarter and turn your goals into progress.</p><div className="auth-mini"><div><b>01</b><span>Personalized paths</span></div><div><b>02</b><span>AI tutor support</span></div><div><b>03</b><span>Track your growth</span></div></div></div><div className="auth-foot">Learn something meaningful every day.</div></div><div className="auth-panel"><form className="auth-form" onSubmit={submitAuth}><div className="mobile-brand"><Brain/> LearnAI</div><span className="eyebrow">{authMode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span><h2>{authMode === 'login' ? 'Sign in to learn' : 'Create your account'}</h2><p className="sub">Your personalized learning space is waiting.</p>{authMode === 'register' && <><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label><label>Learning interests<input value={form.interests} onChange={e=>setForm({...form,interests:e.target.value})} placeholder="Programming, AI"/></label><label>Current skill level<select value={form.skillLevel} onChange={e=>setForm({...form,skillLevel:e.target.value})}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label></>}<label>Email address<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 6 characters"/></label>{error && <div className="error">{error}</div>}<button className="btn primary full" disabled={busy}>{busy ? 'Please wait…' : authMode === 'login' ? 'Sign in' : 'Create account'} <span>→</span></button><p className="switch">{authMode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button type="button" onClick={()=>{setAuthMode(authMode==='login'?'register':'login');setError('');}}>{authMode==='login'?'Create account':'Sign in'}</button></p></form></div></div>;

  const nav = [{name:'Dashboard',icon:Brain},{name:'Learning Path',icon:Route},{name:'AI Tutor',icon:Sparkles},{name:'Quiz Generator',icon:ClipboardList},{name:'Performance',icon:ChartNoAxesColumnIncreasing}];
  const title = {Dashboard:'Your learning overview', 'Learning Path':'Your personalized path','AI Tutor':'Ask your AI tutor','Quiz Generator':'Practice and grow',Performance:'Your learning performance'}[page];
  return <div className="layout"><aside className={`sidebar ${mobileOpen?'open':''}`}><div className="brand"><span className="brand-mark"><Brain/></span> LearnAI</div><div className="side-caption">LEARNING SPACE</div>{nav.map(n=><button key={n.name} className={`nav-link ${page===n.name?'active':''}`} onClick={()=>{setPage(n.name);setMobileOpen(false);}}><n.icon size={18}/>{n.name}</button>)}<div className="side-bottom"><div className="side-tip"><Sparkles/><b>Keep it up!</b><p>Every question you ask brings you one step closer to your goal.</p></div><div className="user-row"><div className="user-avatar">{user.name?.[0]?.toUpperCase()||'S'}</div><div className="user-info"><b>{user.name}</b><small>{user.skillLevel} learner</small></div><button className="icon-button" onClick={logout} title="Sign out"><LogOut size={17}/></button></div></div></aside>
    <main className="main-area"><header className="top-header"><button className="mobile-menu icon-button" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button><div><span className="eyebrow">LEARN / {page.toUpperCase()}</span><h1>{title}</h1><p>Welcome back, {user.name?.split(' ')[0]}. Let's make today count.</p></div><div className="header-avatar">{user.name?.[0]?.toUpperCase()}</div></header>
    {error && <div className="notice">{error}<button onClick={()=>setError('')}>×</button></div>}
    {page==='Dashboard' && <><section className="welcome-banner"><div><span className="pill"><Sparkles size={13}/> YOUR AI LEARNING COMPANION</span><h2>Small steps today.<br/>Big achievements tomorrow.</h2><p>Your interests: {(user.interests||[]).join(' · ')}</p><button className="btn white" onClick={()=>setPage('Learning Path')}>View my learning path <span>→</span></button></div><div className="banner-graphic"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><Brain size={88}/><span className="spark s1">✦</span><span className="spark s2">✧</span></div></section><div className="section-title"><div><span className="eyebrow">AT A GLANCE</span><h2>Your progress</h2></div></div><div className="metric-grid"><Metric icon={BookOpen} value={path.length||3} label="Recommended courses" tint="lavender"/><Metric icon={Target} value={`${performance.averageScore}%`} label="Average quiz score" tint="mint"/><Metric icon={ClipboardList} value={performance.totalAttempts} label="Quiz attempts" tint="peach"/><Metric icon={Clock3} value={user.skillLevel} label="Current skill level" tint="blue"/> </div><div className="section-title"><div><span className="eyebrow">MADE FOR YOU</span><h2>Recommended next steps</h2></div><button className="link-btn" onClick={()=>setPage('Learning Path')}>See full path →</button></div><div className="recommend-grid">{(path.length?path:starterCourses).slice(0,3).map((c,i)=><CourseCard key={c.id} course={c} index={i} onClick={()=>setPage('Learning Path')}/>)}</div><div className="quick-grid"><Quick icon={Sparkles} title="Need an explanation?" text="Ask the AI tutor about any topic." action="Open AI tutor" onClick={()=>setPage('AI Tutor')}/><Quick icon={ClipboardList} title="Ready to practice?" text="Generate a topic-based quiz." action="Create a quiz" onClick={()=>setPage('Quiz Generator')}/></div></>}
    {page==='Learning Path' && <><div className="intro-card"><Route/><div><b>A learning route shaped around you</b><p>{`Suggested for a ${user.skillLevel?.toLowerCase()} learner, using your saved interests.`}</p></div></div><div className="path-list">{(path.length?path:starterCourses).map((c,i)=><div className="path-item" key={c.id}><div className="path-number">{String(i+1).padStart(2,'0')}</div><div className="path-content"><div className="course-top"><span>{c.category}</span><span>{c.duration||'Self-paced'}</span></div><h3>{c.title}</h3><p>{c.description}</p><div className="skill-tags">{(c.skills||[]).map(s=><span key={s}>{s}</span>)}</div></div><span className="status-label">{c.status||'Recommended'}</span></div>)}</div></>}
    {page==='AI Tutor' && <div className="tutor-layout"><div className="tutor-chat"><div className="chat-head"><div className="ai-avatar"><Brain/></div><div><b>LearnAI Tutor</b><small><span className="online-dot"></span> Ready to help you learn</small></div><span className="demo-tag">AI ASSISTANT</span></div><div className="chat-messages">{chat.map((m,i)=><div key={i} className={`message ${m.role}`}><div className="message-icon">{m.role==='assistant'?<Brain size={16}/>:user.name?.[0]}</div><div className="bubble">{m.text}</div></div>)}</div><form className="chat-input" onSubmit={askTutor}><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask anything about your studies…"/><button className="send-btn" disabled={!question.trim()}><Send size={17}/></button></form></div><div className="suggestions"><span className="eyebrow">TRY ASKING</span>{['Explain object-oriented programming','Give me a simple example of recursion','What is the difference between SQL and MongoDB?','Help me prepare for a Python interview'].map(q=><button key={q} onClick={()=>setQuestion(q)}>{q} <span>↗</span></button>)}<div className="privacy-note">Your AI tutor is for learning support. Review important answers and verify technical details.</div></div></div>}
    {page==='Quiz Generator' && <div className="quiz-page"><div className="quiz-setup"><div className="quiz-icon"><ClipboardList/></div><span className="eyebrow">PERSONALIZED PRACTICE</span><h2>Test what you've learned.</h2><p>Choose a topic and generate a five-question practice quiz.</p><label>Quiz topic<input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Python loops, DBMS, AI"/></label><button className="btn primary" disabled={busy||!topic.trim()} onClick={generateQuiz}>{busy?<><LoaderCircle className="spin" size={16}/> Generating…</>:<><Sparkles size={16}/> Generate my quiz</>}</button></div>{quiz.length>0&&<div className="quiz-questions"><div className="quiz-heading"><div><span className="eyebrow">YOUR QUIZ</span><h2>{topic}</h2></div><span className="question-count">{quiz.length} questions</span></div>{quiz.map((q,i)=><div className="question-card" key={i}><b>{i+1}. {q.question}</b><div className="option-list">{q.options.map((o,j)=><label className={`option ${quizDone&&j===q.answer?'correct':''}`} key={j}><input type="radio" name={`q${i}`} checked={Number(answers[i])===j} disabled={quizDone} onChange={()=>setAnswers(a=>({...a,[i]:j}))}/>{o}</label>)}</div>{quizDone&&<p className="explanation"><CheckCircle2 size={15}/> {q.explanation}</p>}</div>)}{!quizDone?<button className="btn primary" disabled={Object.keys(answers).length!==quiz.length} onClick={submitQuiz}>Submit answers</button>:<div className="result-banner"><CheckCircle2/> Quiz completed! Your result has been saved to Performance.</div>}</div>}</div>}
    {page==='Performance' && <><div className="metric-grid performance-metrics"><Metric icon={ChartNoAxesColumnIncreasing} value={`${performance.averageScore}%`} label="Average score" tint="lavender"/><Metric icon={ClipboardList} value={performance.totalAttempts} label="Quizzes completed" tint="mint"/></div><div className="panel"><div className="panel-title"><div><span className="eyebrow">YOUR ACTIVITY</span><h2>Recent quiz results</h2></div></div>{performance.recentResults?.length?performance.recentResults.map(r=><div className="result-row" key={r._id}><div><b>{r.topic}</b><small>{new Date(r.createdAt).toLocaleDateString()}</small></div><div className="result-score">{r.score}/{r.total}<span>{r.percentage}%</span></div></div>):<div className="empty-state"><ChartNoAxesColumnIncreasing/><b>Your progress starts here</b><p>Complete a quiz to see your performance analysis.</p><button className="link-btn" onClick={()=>setPage('Quiz Generator')}>Generate your first quiz →</button></div>}</div><div className="insight-card"><Sparkles/><div><b>Learning insight</b><p>{performance.totalAttempts?`Your average quiz score is ${performance.averageScore}%. Review explanations after each quiz to keep improving.`:'Take your first quiz to start building a personal performance history.'}</p></div></div></>}
    <footer className="footer">© 2026 LearnAI · Personalized learning, one step at a time</footer></main></div>;
}

function Metric({icon:Icon,value,label,tint}) { return <div className="metric-card"><div className={`metric-icon ${tint}`}><Icon size={19}/></div><div><strong>{value}</strong><span>{label}</span></div></div>; }
function CourseCard({course,index,onClick}) { return <article className="course-card"><div className={`course-art art-${index%3}`}><BookOpen size={28}/><span>{course.category}</span></div><div className="course-body"><div className="course-meta"><span>{course.level}</span><span>{course.duration||'Self-paced'}</span></div><h3>{course.title}</h3><p>{course.description}</p><button className="link-btn" onClick={onClick}>Explore learning path →</button></div></article>; }
function Quick({icon:Icon,title,text,action,onClick}) { return <div className="quick-card"><div className="quick-icon"><Icon/></div><div><b>{title}</b><p>{text}</p><button className="link-btn" onClick={onClick}>{action} →</button></div></div>; }
export default App;
