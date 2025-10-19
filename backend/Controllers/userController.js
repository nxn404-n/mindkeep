import { clearCookie } from "../Helpers/clearCookie.js";
import { generateAndSetToken } from "../Helpers/jwt.js";
import User from "../Models/userSchema.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
import Note from "../Models/notesSchema.js";

// Create User
export const createUser = async (req, res, next) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return next(new AppError("Email and Password are required", 400));
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return next(new AppError("Email is already taken", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ password: hashedPassword, email });
  await newUser.save();

  generateAndSetToken(newUser, res);

  res.status(201).json({
    status: "success",
    message: "User created successfully",
  });
};

// Set Username
export const setUsername = async (req, res, next) => {
  const { username } = req.body;
  const { email } = req.user;

  if (!email) {
    return next(new AppError("Authentication failed", 401));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return next(new AppError("Username already taken", 400));
  }

  user.username = username;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Username set successfully",
    user: {
      email: user.email,
      username: user.username,
    },
  });
};

// Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();

  const validUser = await User.findOne({ email: lowercaseEmail });
  if (!validUser) {
    return next(new AppError("Authentication failed", 401));
  }

  const correctPassword = await bcrypt.compare(password, validUser.password);
  if (!correctPassword) {
    return next(new AppError("Authentication failed", 401));
  }

  generateAndSetToken(validUser, res);

  res.status(200).json({
    status: "success",
    message: "Logged in successfully!",
    user: { username: validUser.username },
  });
};

// Delete User
export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    return next(new AppError("User not found", 404));
  }

  await Note.deleteMany({ user: userId });

  clearCookie(res);

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
};

// Logout
export const logout = async (req, res, next) => {
  clearCookie(res);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// Check JWT / Auth
export const checkAuth = async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Not authorized", 401));
  }

  res.status(200).json({
    status: "success",
    message: "User authenticated",
    user: req.user,
  });
};
