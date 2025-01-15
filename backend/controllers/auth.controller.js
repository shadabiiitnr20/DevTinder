import { User } from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;
  try {
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    //
    const isUserduplicate = await User.findOne({ email });
    if (isUserduplicate) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //
    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      genderPreference,
    });
    //
    generateTokenAndSetCookie(res, user._id);
    await user.save();
    //
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log('Error on sign up controller');
    res.status(500).json({
      success: false,
      message: `Sign-up failed: ${error}`,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    //
    const user = await User.findOne({ email }).select('+password');
    //
    const isPasswordValid = await user.validatePassword(password);
    //
    if (!user || !isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Credentials',
      });
    }
    //
    generateTokenAndSetCookie(res, user._id);
    //
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.name} successfully logged in`,
      data: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log('Error on login controller');
    res.status(500).json({
      success: false,
      message: `Log in failed: ${error}`,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('authToken');
  res.status(200).json({
    success: true,
    message: 'Successfully logged out',
  });
};

export const checkAuth = async (req, res) => {
  const user = req.user;
  try {
    res.status(200).json({
      success: true,
      data: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
