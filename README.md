# AI-Powered Smart Learning Platform with Personalized Learning

Full-stack starter project matching the proposed stack:
- Frontend: React.js + Tailwind CSS + Vite
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs
- AI: OpenAI-compatible Chat Completions API (optional; demo fallback included)
- APIs: REST

## Requirements
- Node.js 18 or newer
- npm
- MongoDB local service or MongoDB Atlas URI

## Setup in VS Code

### 1) Backend
Open the project folder in VS Code, then open Terminal > New Terminal:

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and edit the values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_smart_learning
JWT_SECRET=replace_this_with_a_long_random_secret
AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Expected message: `API server running at http://localhost:5000`
When MongoDB is available, it also prints `MongoDB connected`.

### 2) Frontend
Open a second VS Code terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL, usually http://localhost:5173.

## First use
1. Register a student account from the app.
2. Sign in.
3. Explore the personalized path, AI tutor, quiz generator and performance page.
4. The app works in demo AI mode without an AI key. Add a valid API key to `backend/.env` to enable live LLM responses.
5. MongoDB must be running for registration, login and saved progress.

## AI configuration
The backend sends requests to an OpenAI-compatible `/chat/completions` endpoint using `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL`. Keep your key only in `backend/.env`; never put it in frontend code or commit `.env` to Git.

## Main REST endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (JWT)
- `GET /api/learning/path` (JWT)
- `POST /api/ai/tutor` (JWT)
- `POST /api/ai/quiz` (JWT)
- `GET /api/performance` (JWT)
- `POST /api/performance/quiz-result` (JWT)

## Troubleshooting
- `MongoDB connection failed`: start MongoDB locally or set a valid Atlas `MONGO_URI`.
- `JWT_SECRET is missing`: copy `.env.example` to `.env` and set a secret.
- Port in use: change `PORT` in backend `.env`.
- Frontend cannot reach API: make sure backend is running on port 5000.
- Live AI unavailable: check API key, model access, and base URL. Demo responses are used when no key is configured.

This is an educational project starter. Before production deployment, add stricter validation, rate limiting, logging, HTTPS, secure deployment secrets, and appropriate privacy controls.
