import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
//
import { connectDB } from './db/connectDB.js';
//
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import matchRouter from './routes/match.route.js';
import messageRouter from './routes/message.route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

//For handling cors issue
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

//To parse the incoming requests (req.body). This middleware needs to be before all other middlewares
app.use(express.json());
app.use(cookieParser());
//Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/matches', matchRouter);
app.use('api/messages', messageRouter);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server started on PORT: ${PORT}`);
});
