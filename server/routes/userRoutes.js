import express from "express";
import {
  getAllUsers,
  getUserById,
  upsertUser,
  deleteUser,
  getUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/:id/profile", getUserProfile);

// User routes
router.post("/", upsertUser);
router.delete("/:id", deleteUser);

export default router;
