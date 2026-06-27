import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js"; 
import { 
    sendInquiry, 
    getSellerInquiries, 
    markAsRead 
} from "../controllers/inquiry.controller.js"; 

const inquiryRouter = express.Router();

inquiryRouter.post("/", protect, authorize("buyer"), sendInquiry);
inquiryRouter.get("/seller", protect, authorize("seller"), getSellerInquiries); 
inquiryRouter.patch("/:id/read", protect, markAsRead); 

export default inquiryRouter;