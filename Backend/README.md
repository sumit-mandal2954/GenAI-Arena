# GenAI Arena - Backend

Node.js/Express backend for real-time AI solution streaming and evaluation using LangChain.

## Project Overview

This backend handles:
- Dual AI model streaming (Mistral & Cohere)
- Real-time token emission to frontend
- Judge evaluation using Google Gemini
- Authentication & user management
- Database persistence with MongoDB

## Tech Stack

- Express.js for REST API
- LangChain + LangGraph for AI orchestration
- TypeScript for type safety
- MongoDB with Mongoose for data persistence
- JWT for authentication
- Passport.js for OAuth2 (Google)

## AI Models

- **Solution 1**: Mistral (fast, creative solutions)
- **Solution 2**: Cohere (comprehensive, detailed solutions)
- **Judge**: Google Gemini (structured evaluation)

## Core Architecture

### Graph-based Orchestration (`src/ai/graph.model.ts`)

The backend uses LangGraph StateGraph for AI orchestration:

```
solutionNode → judgeNode → END
```

#### Judge Implementation

Two judge functions serve different purposes:

**1. `judgeNode` (Graph Node)**
- Part of the StateGraph pipeline
- Runs synchronously as a graph node
- Used: When executing full pipeline (generate + judge)
- Input: State object with problem, solution_1, solution_2
- Output: judge_recommendation object

**2. `runJudgeOnly()` (Standalone Generator)**
- Independent streaming function
- Used: For quick evaluation without generating solutions
- Input: Individual strings (solution_1, solution_2, problem)
- Output: Generator yielding `{ type: "final", content: {...} }`
- Error handling: Catches errors and yields error payload

**3. `runGraph()` (Streaming Generator)**
- Main entry point for dual AI streaming
- Implements fair round-robin token emission (5ms delay)
- Prevents one fast AI from dominating output
- Yields tokens with node identifier: `{ type: "token", node: "solution_1"|"solution_2", content: token }`

## API Endpoints

### Chat Routes (`/api/chat`)
- `POST /generate` - Start dual AI streaming
- `POST /judge` - Evaluate provided solutions (uses `runJudgeOnly`)

### Graph Routes (`/api/graph`)
- Execute full pipeline with StateGraph

### Auth Routes (`/api/auth`)
- User registration, login, JWT management

### Google OAuth Routes (`/api/google-auth`)
- OAuth2 authentication flow

## Running the Project

```bash
npm install
npm run dev        # Start dev server with hot reload
```

Server runs on `http://localhost:5000`

## Environment Variables

Create `.env` file:

```env
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
MISTRAL_API_KEY=your_key
COHERE_API_KEY=your_key
GOOGLE_API_KEY=your_key
```

## Recent Cleanup (May 2026)

### Code Quality Improvements

- Identified `judgeNode` in StateGraph as potentially redundant (added to repo memory)
- Verified both judge implementations are functional but serve distinct purposes
- Documented when to use `judgeNode` vs `runJudgeOnly()`

### Streaming Optimization (Previous Fix)

Added **TOKEN_EMIT_DELAY (5ms)** in `runGraph()`:
- Throttles token emission to prevent dumping
- Ensures smooth streaming even when one AI finishes early
- Both solution streams appear to flow naturally

## File Structure

```
Backend/
├── server.ts                 # Express app entry
├── src/
│   ├── app.ts               # Route setup
│   ├── ai/
│   │   ├── ai.model.ts      # LLM model initialization
│   │   └── graph.model.ts   # StateGraph & streaming functions
│   ├── controller/          # Route handlers
│   ├── routes/              # API route definitions
│   ├── middleware/          # Auth & validation middleware
│   ├── models/              # Mongoose schemas
│   ├── validator/           # Input validation
│   └── config/              # Configuration files
└── tsconfig.json
```

## Debugging

Enable debug logs:
```javascript
// In graph.model.ts
console.error("❌ Mistral error:", e);  // Error logging
console.error("🔴 Error in runGraph:", err);
```

Monitor streaming in frontend console - watch for token payload objects.