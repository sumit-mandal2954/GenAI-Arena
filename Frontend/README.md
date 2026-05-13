# GenAI Arena - Frontend

Real-time AI solution streaming and judging platform built with React + Vite.

## Project Overview

This frontend application enables users to submit coding problems and watch two AI models (Mistral & Cohere) generate solutions concurrently with real-time token streaming. A judge AI (Google) then evaluates both solutions.

## Features

- **Real-time Streaming**: Watch AI solutions appear token-by-token as they're generated
- **Dual AI Comparison**: Mistral vs Cohere solutions in side-by-side format
- **AI Judge**: Google Gemini evaluates and scores both solutions
- **Redux State Management**: Efficient state handling for streaming responses
- **Responsive UI**: Built with Tailwind CSS

## Tech Stack

- React with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- React Markdown for rendering AI responses

## Recent Cleanup (May 2026)

### Removed Unnecessary Debug Code

#### `chat.slice.js` Reducer Optimization
- **Removed**: Unused `prevLength` variable
- **Removed**: Debug console.log that logged token appending
- **Impact**: Cleaner state updates, reduced console spam during streaming

#### `ResponseCard.jsx` Component Cleanup
- **Removed**: useEffect hook with 3 console.log statements
- **Removed**: Unused `useEffect` import
- **Cleaned**: Simplified component to focus only on rendering
- **Impact**: Reduced console output clutter, smaller bundle

### Why These Changes?

These debug logs were useful during development but created unnecessary noise in production:
- Redux reducer was logging every token append (hundreds of logs per response)
- ResponseCard was logging content length metrics on every update
- With streaming at 5ms per token, the logs became overwhelming in the browser console

## Running the Project

```bash
npm install
npm run dev
```

## Backend Integration

The frontend connects to the backend at `http://localhost:5000` for:
- `/api/chat/generate` - Start dual AI streaming
- `/api/chat/judge` - Get judge evaluation for existing solutions
