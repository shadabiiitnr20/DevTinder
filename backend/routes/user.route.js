import express from 'express';
import { verifyAuth } from '../middleware/verifyAuth.js';
import { updateProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.put('/update-profile', verifyAuth, updateProfile);

export default userRouter;
