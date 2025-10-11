import { clearCookie } from "../Helpers/clearCookie.js";
import { generateAndSetToken } from "../Helpers/jwt.js";
import User from "../Models/userSchema.js";
import bcrypt from "bcryptjs";

//Create User
export const createUser = async (req, res) => {
  try {
    const { password, email } = req.body;

    if ( !password || !email) {
      return res.status(400).json({
        error: "Email and Password is required!!"
      })
    }

    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
     return res.status(409).json({
        error: "Email is already taken"
      })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ password: hashedPassword, email });
    await newUser.save();

    generateAndSetToken(newUser, res);

    res.status(201).json({
      message: "User created successfully",
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

//Set Username
export const setUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const { email } = req.user;

    if (!email) {
      return res.status(401).json({
        error: "Authentication failed"
      })
    };

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      })
    };

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        error: "Username already taken"
      })
    };

    user.username = username;
    await user.save();

    res.status(200).json({
      message: "Username set successfully",
      user: {
        email: user.email,  
        username: user.username
      }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

//Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowercaseEmail = email.toLowerCase();

    const validUser = await User.findOne({ email: lowercaseEmail });
    const correctPassword = await bcrypt.compare(password, validUser.password);

    if (validUser && correctPassword) {
      generateAndSetToken(validUser, res);

      res.status(200).json({
        message: "Logged in successfully!",
        user: {username: validUser.username}
      })
    } else {
      res.status(401).json({
        error: "Authentication failed!"
      })
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

//Delete user
export const deleteUser = async (req, res) => {
  try {
    //Todo: Add delete all notes of that user after creating the notes functionality
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    clearCookie(res);

    res.status(200).json({
      message: "User deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

//Logout
export const logout = async (req, res) => {
  try {
    clearCookie(res);

    res.status(200).json({
      message: "Logged out successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

//Check jwt
export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
    return res.status(401).json({
      message: "Not authorized"
    })
  };

  res.status(200).json({
    user: req.user,
    message: "User authenticated"
  })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}