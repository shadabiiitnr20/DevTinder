import express from 'express';
import { verifyAuth } from '../middleware/verifyAuth.js';
import {
  getMatches,
  getUsersProfile,
  swipeLeft,
  swipeRight,
} from '../controllers/match.controller.js';

const matchRouter = express.Router();

matchRouter.post('/swipe-right/:likedUserId', verifyAuth, swipeRight);
matchRouter.post('/swipe-left/:dislikedUserId', verifyAuth, swipeLeft);
//
matchRouter.get('/my-feed', verifyAuth, getUsersProfile);
matchRouter.get('/', verifyAuth, getMatches);

export default matchRouter;
