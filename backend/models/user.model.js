import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 20,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Email is not valid ${value}`);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(`Password is not valid, enter a strong password`);
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    genderPreference: {
      type: String,
      enum: ['male', 'female', 'both'],
    },
    bio: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://geographyandyou.com/images/user-profile.png',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(`Image URL is not valid: ${value}`);
        }
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// userSchema.pre('save', async function (next) {
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

userSchema.methods.validatePassword = async function (enteredPassword) {
  const passwordInDB = this.password;
  const isPasswordValid = await bcrypt.compare(enteredPassword, passwordInDB);
  return isPasswordValid;
};

export const User = mongoose.model('User', userSchema);
