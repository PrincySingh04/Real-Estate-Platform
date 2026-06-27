import express from 'express';
import { forgotPassword, getMe, login, register, resetPassword, verifyEmail } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';  // protect was used but never imported

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/me", protect, getMe);
authRouter.post("/verify-email", verifyEmail);        // "./" → "/"

authRouter.post("/forgot-password", forgotPassword);  // "./" → "/"
authRouter.post("/reset-password/:token", resetPassword);  // wrong handler + missing :token param
export default authRouter;