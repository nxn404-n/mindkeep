import express from "express";
import { checkAuth, createUser, deleteUser, login, logout, setUsername } from "../Controllers/userController.js";
import { checkJwt } from "../Middlewares/checkJwt.js";
import { usernameValidator, userValidator } from "../Validators/userValidator.js";
import { handleValidatorErrors } from "../Middlewares/handleValidatorErrors.js";

const router = express.Router();

router.post("/signup", userValidator, handleValidatorErrors, createUser);
router.post("/login", userValidator, handleValidatorErrors, login);
router.post("/setusername", checkJwt, usernameValidator, handleValidatorErrors, setUsername);
router.delete("/:id", deleteUser);
router.post("/logout", logout);

/* This route is for checking the jwt token and sends user info to frontend*/
router.get("/auth", checkJwt, checkAuth);

export default router;