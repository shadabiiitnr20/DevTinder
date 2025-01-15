import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyAuth = async (req, res, next) => {
  const { authToken } = req.cookies;
  try {
    if (!authToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token user is not authorized',
      });
    }
    //
    const decodedObject = jwt.verify(authToken, process.env.JWT_TOKEN);
    if (!decodedObject) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Token',
      });
    }
    //
    const { userId } = decodedObject;
    const user = await User.findById(userId);
    //
    if (!user) {
      throw new Error('User does not exists');
    }
    //
    req.user = user;
    next();
  } catch (error) {
    console.log('Error in auth middleware: ', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};
