import express from 'express';
import {getGraphData } from './controller/graph.controller.js';
import cors from 'cors';

export const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend URL and port
    credentials: true
}));

/**
 * Health check endpoint
 */ 

app.get('/health',(req,res)=>{
    res.status(200).json({status:'ok'})
})

app.post('/run-graph', getGraphData);