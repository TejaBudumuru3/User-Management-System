import { log } from 'console';
import express from 'express'
import { config } from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth';
import { authenticateToken } from './middleware/auth';
import { requiredRole } from './middleware/rbac'
import userRouter from './routes/users';
import path from 'path';
import cookieParser from 'cookie-parser';

config()

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/auth',authRouter)
app.use(cookieParser());

app.get('/api/protected', authenticateToken, requiredRole(['admin']), (req, res) => {
  res.json({ userId: req.userId, role: req.user?.role });
});

app.use('/api/users', userRouter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function start(){
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI ? process.env.MONGODB_URI: "")
        log('db connnected well at: ', conn.connection.host)
        const PORT = process.env.PORT || 3000
        app.listen(PORT ,()=>{
            log(`server started at port: ${PORT}`)
        })
    }
    catch(e){
        throw new Error(`failed to start server: ${e instanceof Error ? e.message : "unknown error"}`)
    }
}

start()