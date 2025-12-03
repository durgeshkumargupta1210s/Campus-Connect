import express from "express";
import {
  getAllShows,
  getShowsByEventId,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
  getAvailableSeats,
} from "../controllers/showController.js";

const router = express.Router();

// Public routes
router.get("/", getAllShows);
router.get("/event/:eventId", getShowsByEventId);
router.get("/:id", getShowById);
router.get("/:id/seats", getAvailableSeats);

// Admin routes
router.post("/", createShow);
router.put("/:id", updateShow);
router.delete("/:id", deleteShow);

export default router;
