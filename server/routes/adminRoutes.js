import express from "express";
import {
  getDashboardStats,
  getRecentBookings,
  getEventsWithStats,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin dashboard routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/bookings/recent", getRecentBookings);
router.get("/events/stats", getEventsWithStats);

export default router;
