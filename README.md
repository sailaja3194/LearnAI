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
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/ai_smart_learning
JWT_SECRET=2b8a24fabc0e6e52a345a036119ac24d22939a973c1d5d259704a48f2b3432fc
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

- **MongoDB Error:** Ensure MongoDB is running and `MONGO_URI` is correctly configured.
- **Authentication Error:** Set a valid `JWT_SECRET` in `backend/.env`.
- **Port Conflict:** Ensure the backend port (5001) is available.
- **API Connection Error:** Verify the backend URL and CORS configuration.
- **AI Service Error:** Check your API key, model access, and billing configuration.
- **Missing Dependencies:** Run `npm install` in both frontend and backend folders.

**Security Note:** Never commit `.env` files, API keys, or sensitive credentials to GitHub.

This is an educational project starter. Before production deployment, add stricter validation, rate limiting, logging, HTTPS, secure deployment secrets, and appropriate privacy controls.
