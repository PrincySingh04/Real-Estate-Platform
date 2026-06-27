import express from 'express';
import {
  addProperty,
  deleteProperty,
  getAllProperties,
  getMyProperties,
  getPropertyCounts,
  getPropertyDetails,
  updateProperty,
  updatePropertyStatus,
  getSellerDashboard
} from '../controllers/property.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/uploadmiddleware.js';


const propertyRouter = express.Router();

propertyRouter.get("/", getAllProperties);
propertyRouter.get("/counts", getPropertyCounts);
propertyRouter.get("/my", protect, authorize("seller"), getMyProperties);
propertyRouter.get("/seller/dashboard", protect, authorize("seller"), getSellerDashboard);

propertyRouter.post("/", protect, authorize("seller"), upload.array("images", 10), addProperty);
propertyRouter.put("/:id", protect, authorize("seller"), upload.array("images", 10), updateProperty);
propertyRouter.patch("/:id/status", protect, authorize("seller"), updatePropertyStatus);
propertyRouter.delete("/:id", protect, authorize("seller"), deleteProperty);

propertyRouter.get("/:id", getPropertyDetails);

export default propertyRouter;