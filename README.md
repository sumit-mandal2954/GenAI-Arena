# GenAI Arena

**A Real-time AI Solution Streaming and Comparison Platform**

GenAI Arena is a competitive platform where two cutting-edge AI models (Mistral & Cohere) compete to solve coding problems. Watch solutions generate in real-time and let Google Gemini provide fair verdicts on both approaches.

---

## 🎯 Project Overview

GenAI Arena enables users to:
- Submit coding problems and challenges
- Watch two AI models generate solutions simultaneously with real-time token streaming
- Compare solutions side-by-side as they're created
- Get AI-powered evaluation and scoring from an independent judge (Google Gemini)
- Track solution quality metrics and model performance

This is not just a competition—it's a learning platform to understand different AI approaches to problem-solving.

---

## 🏗️ Project Structure

```
GenAI Arena/
├── Backend/                 # Node.js/Express API Server
│   ├── src/
│   │   ├── ai/             # AI models and graph orchestration
│   │   ├── config/         # Database and auth configuration
│   │   ├── controller/     # Route controllers (auth, graph, etc.)
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API route definitions
│   │   ├── validator/      # Input validation
│   │   └── app.ts          # Express app setup
│   ├── server.ts           # Server entry point
│   ├── package.json        # Dependencies
│   └── tsconfig.json       # TypeScript configuration
│
├── Frontend/               # React + Vite UI
│   ├── src/
│   │   ├── app/            # Redux store configuration
│   │   ├── features/       # Feature modules (auth, chats)
│   │   │   ├── auth/       # Authentication features
│   │   │   └── chats/      # Chat/problem interface
│   │   ├── routes/         # React Router configuration
│   │   └── main.jsx        # React entry point
│   ├── vite.config.js      # Vite build configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── index.html          # HTML entry point
│   └── package.json        # Dependencies
│
└── README.md              # This file
```

---

## 🚀 Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **AI Orchestration**: LangChain + LangGraph
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Passport.js (Google OAuth2)
- **Real-time**: Server-Sent Events (SSE) for token streaming
- **Runtime**: Node.js with tsx for TypeScript execution

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Markdown Rendering**: React Markdown
- **Syntax Highlighting**: Highlight.js

---

## 🤖 AI Models Architecture

### Solution Generators
- **Mistral**: Fast, creative solutions with optimized performance
- **Cohere**: Comprehensive, detailed solutions with explanations

### Judge
- **Google Gemini**: Independent evaluation and scoring of both solutions

### Streaming
- Real-time token emission from backend to frontend
- Solutions appear character-by-character as generated
- Non-blocking concurrent execution of both models

---

## 📋 Core Features

### Authentication
- Google OAuth2 login integration
- JWT-based session management
- User profile management
- Secure password handling

### Problem Submission
- Code problem input with validation
- Real-time solution generation tracking
- Dual model execution in parallel

### Real-time Streaming
- Token-by-token solution display
- Progress indicators for generation status
- Fallback error handling for stream interruptions

### AI Evaluation
- Automated judge assessment
- Performance metrics and scoring
- Side-by-side solution comparison

### Responsive UI
- Mobile-friendly design
- Optimized for all screen sizes
- Touch-friendly interface elements

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB instance (local or cloud)
- Google OAuth2 credentials (for authentication)

### Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file with required variables
# DATABASE_URL=mongodb://...
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# JWT_SECRET=...

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env file if needed
# VITE_API_URL=http://localhost:5000

# Start development server
npm run dev

# Application runs on http://localhost:5173

# Build for production
npm run build
```

---

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/google` - Google OAuth callback
- `POST /auth/logout` - User logout

### AI Solutions
- `POST /graph/solve` - Submit problem and stream solutions
  - Returns SSE stream with real-time tokens
  - Executes both Mistral and Cohere in parallel
  
- `POST /graph/judge` - Get AI judge evaluation
  - Analyzes both solutions
  - Returns scoring and verdict

---

## 🔄 Data Flow

1. **User submits problem** → Frontend sends to Backend
2. **Backend initiates dual model execution** → LangGraph orchestrates parallel AI calls
3. **Real-time streaming begins** → Tokens stream back via SSE
4. **Frontend receives tokens** → Redux updates UI in real-time
5. **Solutions complete** → Backend triggers judge evaluation
6. **Judge analysis** → Frontend displays verdict and metrics

---

## 🔐 Security

- JWT tokens for stateless authentication
- Google OAuth2 for secure third-party login
- Password hashing with bcrypt
- Input validation on all endpoints
- CORS configuration for cross-origin requests
- Protected routes with middleware authentication

---

## 📊 Project Metrics

- **Backend API**: RESTful with streaming support
- **Frontend Performance**: Optimized with Vite
- **AI Models**: Concurrent execution with dual solutions
- **Database**: MongoDB with persistent user data
- **Authentication**: Multi-provider (local + Google OAuth)

---

## 🐛 Troubleshooting

### Connection Issues
- Verify MongoDB connection string in `.env`
- Ensure backend server is running on correct port
- Check CORS configuration in Express app

### Authentication Errors
- Verify Google OAuth credentials are valid
- Check JWT_SECRET is set consistently
- Clear browser cookies if session issues persist

### Streaming Not Working
- Check browser supports Server-Sent Events
- Verify network connectivity
- Review browser console for errors

---

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

---

## 🎓 Learning Resources

This project demonstrates:
- Full-stack TypeScript development
- Real-time streaming with SSE
- AI orchestration with LangChain
- React state management with Redux
- RESTful API design
- OAuth2 authentication flows
- MongoDB data modeling
- Tailwind CSS for responsive design

---

## 🚀 Getting Started Quick Guide

### For Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/sumit-mandal2954/GenAI-Arena.git
   cd GenAI-Arena
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   # Configure .env file
   npm run dev
   ```

3. **Setup Frontend** (in new terminal)
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 🎯 Key Features Explained

### Real-time Streaming
Solutions appear token-by-token as they're generated, giving users a real-time view of how each AI model thinks through the problem.

### Dual AI Comparison
Side-by-side comparison helps understand the differences in approach, speed, and solution quality between Mistral and Cohere.

### AI Judge Evaluation
Google Gemini provides objective evaluation criteria:
- Code correctness
- Performance considerations
- Best practices adherence
- Clarity and maintainability

---

## 👨‍💻 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see package.json for details.

---

## 📞 Support & Contact

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review the Backend and Frontend README files for specific details

---

## 🎯 Future Roadmap

- [ ] Support for more AI models (GPT-4, Claude, Llama, etc.)
- [ ] Problem difficulty levels and categories
- [ ] User leaderboards and achievements
- [ ] Solution history and analytics dashboard
- [ ] Custom judging criteria and metrics
- [ ] API rate limiting and usage analytics
- [ ] Mobile native applications (React Native)
- [ ] Real-time collaborative problem solving
- [ ] Webhook support for external integrations
- [ ] Advanced filtering and search capabilities

---

## 📈 Performance Optimization

- **Frontend**: Vite for fast build and HMR
- **Backend**: Streaming responses reduce memory footprint
- **Database**: Mongoose indexing for quick queries
- **State Management**: Redux for efficient re-renders
- **API**: RESTful design with proper caching headers

---

## 🔔 Recent Updates (May 2026)

### Branding & Documentation
- ✅ Rebranded to "GenAI Arena" with professional styling
- ✅ Fixed favicon visibility and metadata
- ✅ Created comprehensive project documentation
- ✅ Updated all UI headers and taglines
- ✅ Consistent naming across all files

### Frontend Optimizations
- ✅ Removed unnecessary debug logging
- ✅ Cleaned up Redux state variables
- ✅ Improved performance with optimized selectors

---

## 🏆 Why GenAI Arena?

- **Educational**: Learn how different AI models approach problems
- **Fair Comparison**: Independent judge evaluation
- **Real-time Insights**: Watch the thought process unfold
- **Professional**: Production-ready architecture
- **Scalable**: Built to handle multiple concurrent submissions

---

**Built with ❤️ | GenAI Arena © 2026**

For more details, visit the individual README files in Backend/ and Frontend/ directories.
