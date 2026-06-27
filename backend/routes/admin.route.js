import express from "express";
import { authorize, protect } from '../middleware/auth.middleware.js';
import {
  blockUser,
  deleteProperty,
  deleteUser,
  getAllUsers,
  getAllInquiries,
  getAllProperties,
  getDashBoardStats,
  getPendingSellers,
  approveSellers
} from '../controllers/admin.controller.js';

const adminRouter = express.Router();

adminRouter.use(protect, authorize("admin"));

adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:id/block", blockUser);
adminRouter.delete("/users/:id", deleteUser);
adminRouter.get("/properties", getAllProperties);
adminRouter.delete("/properties/:id", deleteProperty);
adminRouter.get("/inquiries", getAllInquiries); 
adminRouter.get("/stats", getDashBoardStats);
adminRouter.get("/pending-sellers", getPendingSellers);
adminRouter.patch("/approve-seller/:id", approveSellers);

export default adminRouter;