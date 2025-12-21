# English Academy - Full Stack Application

A modern English learning platform with AI-powered chatbot, test evaluation, and booking system.

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v14 or higher ([Download](https://www.postgresql.org/download/))

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Database

```bash
# Create the database
createdb english_academy

# Run the schema setup
psql -d english_academy -f supabase/local-schema.sql
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your API keys (see [API Keys Guide](#-api-keys-guide) below).

### 4. Run the Application

```bash
# Run both frontend and backend together
npm run dev:all
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 🔑 API Keys Guide

### Required API Keys

| Service | Purpose | Free Tier | Get API Key |
|---------|---------|-----------|-------------|
| **Google Gemini** | AI Chatbot + Test Evaluation | ✅ 60 req/min | [Get Key](https://aistudio.google.com/app/apikey) |
| **ElevenLabs** | Text-to-Speech (Listening Tests) | ✅ 10K chars/month | [Get Key](https://elevenlabs.io/app/settings/api-keys) |
| **PostgreSQL** | Database | ✅ Local (Free) | Install locally |

### Alternative AI Providers

| Provider | Free Tier | Get API Key |
|----------|-----------|-------------|
| **Groq** | ✅ 30 req/min | [Get Key](https://console.groq.com/keys) |
| **OpenAI** | ❌ $5 trial credits | [Get Key](https://platform.openai.com/api-keys) |

### How to Get Each API Key

#### 1. Google Gemini API (Recommended - FREE)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add to `.env`:
   ```
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_key_here
   ```

#### 2. ElevenLabs API (FREE)

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Create a free account
3. Go to [API Settings](https://elevenlabs.io/app/settings/api-keys)
4. Copy your API key and add to `.env`:
   ```
   ELEVENLABS_API_KEY=your_key_here
   ```

#### 3. Groq API (Alternative - FREE)

1. Go to [Groq Console](https://console.groq.com/)
2. Create an account
3. Go to [API Keys](https://console.groq.com/keys)
4. Create a new key and add to `.env`:
   ```
   AI_PROVIDER=groq
   GROQ_API_KEY=your_key_here
   ```

---

## 📁 Project Structure

```
├── api/                        # Backend API (Node.js + Express)
│   ├── index.ts                # Express server entry point
│   ├── db.ts                   # PostgreSQL connection
│   └── routes/
│       ├── laila-chat.ts       # AI chatbot endpoint
│       ├── book-trial.ts       # Booking system
│       ├── evaluate-test.ts    # Test evaluation
│       └── generate-listening-audio.ts # TTS
│
├── src/
│   ├── services/
│   │   └── api.ts              # Frontend API service layer
│   ├── components/             # React components
│   └── pages/                  # Page components
│
├── supabase/
│   └── local-schema.sql        # PostgreSQL schema
│
├── postman/
│   └── english-academy.json    # Postman collection
│
├── .env.example                # Environment template
└── README.md                   # This file
```

---

## 📋 Files That Need API Keys

| File | Environment Variable | Purpose |
|------|---------------------|---------|
| `api/routes/laila-chat.ts` | `GEMINI_API_KEY` or `OPENAI_API_KEY` or `GROQ_API_KEY` | AI-powered chatbot |
| `api/routes/evaluate-test.ts` | `GEMINI_API_KEY` or `OPENAI_API_KEY` or `GROQ_API_KEY` | Test answer evaluation |
| `api/routes/generate-listening-audio.ts` | `ELEVENLABS_API_KEY` | Text-to-speech audio |
| `api/db.ts` | `DATABASE_URL` | PostgreSQL database |

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Run frontend only (Vite)
npm run dev:server   # Run backend only (Express)
npm run dev:all      # Run both frontend + backend

# Database
npm run db:setup     # Run PostgreSQL schema setup

# Build
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check and config status |
| GET | `/api/book-trial` | Get available time slots |
| POST | `/api/book-trial` | Book a trial class |
| POST | `/api/laila-chat` | Chat with AI assistant (SSE streaming) |
| POST | `/api/evaluate-test` | Evaluate test answers |
| POST | `/api/generate-listening-audio` | Generate TTS audio |

### Testing with Postman

1. Import `postman/english-academy.json` into Postman
2. The collection includes all API endpoints with example requests

---

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Check if database exists
psql -l | grep english_academy

# Create database if missing
createdb english_academy
```

### API Key Issues

Run the health check to verify configuration:
```bash
curl http://localhost:3001/api/health
```

Response shows which keys are configured:
```json
{
  "status": "ok",
  "env": {
    "ai_provider": "gemini",
    "has_ai_key": true,
    "has_elevenlabs": true,
    "has_database": true
  }
}
```

### Port Already in Use

```bash
# Find and kill process on port 3001
lsof -i :3001
kill -9 <PID>
```

---

## 📝 Environment Variables Reference

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/english_academy

# AI Provider (choose one)
AI_PROVIDER=gemini          # Options: gemini, openai, groq
GEMINI_API_KEY=xxx          # If using Gemini
OPENAI_API_KEY=xxx          # If using OpenAI
GROQ_API_KEY=xxx            # If using Groq

# Text-to-Speech
ELEVENLABS_API_KEY=xxx

# Server
PORT=3001
CORS_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3001/api
```

---

## 🤝 Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **AI**: Google Gemini / OpenAI / Groq
- **TTS**: ElevenLabs

---

## 📄 License

MIT License
