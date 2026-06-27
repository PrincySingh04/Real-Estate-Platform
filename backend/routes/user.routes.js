import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/uploadmiddleware.js";
import {
    getProfile,
    getPublicProfile,
    updateProfile
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", protect, getProfile);
userRouter.put("/profile", protect, upload.single("profilePic"), updateProfile);
userRouter.get("/public/:id", getPublicProfile);

export default userRouter;