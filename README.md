# Premium AI Educational Assistant - SaaS Platform

A modern, full-stack AI platform designed to help students analyze PDFs, YouTube videos, websites, and voice notes into educational summaries and chat-based tutoring.

## 🚀 Stack
- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Python FastAPI, Uvicorn, Motor (MongoDB)
- **AI/ML**: Google Gemini (LLM), HuggingFace (Fallback), Sentence-Transformers (Embeddings), Faster-Whisper (Transcription)
- **Database**: MongoDB Atlas (Metadata), Qdrant Cloud (Vector DB)

## 📦 Deployment
This project is configured as a monorepo for easy deployment to:
- **Frontend**: [Vercel](https://vercel.com) (automatic Next.js optimization)
- **Backend**: [Render](https://render.com) or [Railway](https://railway.app) (Python/Docker support)

### Setup
1. Clone the repository
2. `pip install -r requirements.txt`
3. `cd frontend && npm install`
4. Rename `.env.example` to `.env` and fill in your API keys

### Local Start
```powershell
./run_app.ps1
```
