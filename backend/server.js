import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
//
import { connectDB } from './db/connectDB.js';
//
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import matchRouter from './routes/match.route.js';
import messageRouter from './routes/message.route.js';
import { initializeSocket } from './socket/socket.server.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8080;

//Initialize socket
initializeSocket(httpServer);

//For handling cors issue
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

//To parse the incoming requests (req.body). This middleware needs to be before all other middlewares
app.use(express.json());
app.use(cookieParser());
//Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/matches', matchRouter);
app.use('/api/messages', messageRouter);

httpServer.listen(PORT, async () => {
  await connectDB();
  console.log(`Server started on PORT: ${PORT}`);
});
