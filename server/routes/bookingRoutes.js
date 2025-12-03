// server/routes/bookingRoutes.js
import express from "express";
import {
  getAllBookings,
  getBookingById,
  getUserBookings,
  createBooking,
  cancelBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// GET /api/bookings -> all bookings
router.get("/", getAllBookings);

// GET /api/bookings/:id -> single booking
router.get("/:id", getBookingById);

// GET /api/bookings/user/:userId -> user bookings
router.get("/user/:userId", getUserBookings);

// POST /api/bookings -> create booking
router.post("/", createBooking);

// PUT /api/bookings/:id/cancel -> cancel booking
router.put("/:id/cancel", cancelBooking);

// DELETE /api/bookings/:id -> delete booking
router.delete("/:id", deleteBooking);

export default router;
