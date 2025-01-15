import express from 'express';
import {
  signup,
  login,
  logout,
  checkAuth,
} from '../controllers/auth.controller.js';
import { verifyAuth } from '../middleware/verifyAuth.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

authRouter.get('/me', verifyAuth, checkAuth);

export default authRouter;
