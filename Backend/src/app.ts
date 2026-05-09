import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route.js';
import graphRoute from './routes/graph.route.js';
import googleAuthRouter from './routes/googleAuth.route.js';

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// 🔥 CORS configuration to accept requests from multiple ports during development
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

/**
 * Health check endpoint
 */ 

app.get('/health',(req,res)=>{
    res.status(200).json({status:'ok'})
})

app.use('/api/run-graph', graphRoute);
app.use('/api/auth', authRoute);
app.use('/auth', googleAuthRouter);