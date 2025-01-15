import express from 'express';
import { verifyAuth } from '../middleware/verifyAuth.js';
import {
  getConversation,
  sendMessage,
} from '../controllers/message.controller.js';

const messageRouter = express.Router();

messageRouter.use(verifyAuth);
//
messageRouter.post('/send', sendMessage);
messageRouter.get('/conversation/:userId', getConversation);

export default messageRouter;
