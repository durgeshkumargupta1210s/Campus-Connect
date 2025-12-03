// server/routes/eventRoutes.js
import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// GET /api/events -> all events
router.get("/", getAllEvents);

// GET /api/events/:id -> single event
router.get("/:id", getEventById);

// POST /api/events -> create event
router.post("/", createEvent);

// PUT /api/events/:id -> update event
router.put("/:id", updateEvent);

// DELETE /api/events/:id -> delete event
router.delete("/:id", deleteEvent);

export default router;
