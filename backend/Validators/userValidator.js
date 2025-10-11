import { body } from 'express-validator';

export const userValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
]

export const usernameValidator = [
  body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 10 }).withMessage("Username must be 3-10 characters")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores")
    .trim()
    .escape()
]