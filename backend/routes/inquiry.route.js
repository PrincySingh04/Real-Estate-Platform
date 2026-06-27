import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js"; // ✅ added protect + .js
import { 
    sendInquiry, 
    getSellerInquiries, 
    markAsRead 
} from "../controllers/inquiry.controller.js"; // ✅ added all functions + .js

const inquiryRouter = express.Router();

inquiryRouter.post("/", protect, authorize("buyer"), sendInquiry);
inquiryRouter.get("/seller", protect, authorize("seller"), getSellerInquiries); // ✅ fixed typos
inquiryRouter.patch("/:id/read", protect, markAsRead); // ✅ fixed route + function name

export default inquiryRouter;