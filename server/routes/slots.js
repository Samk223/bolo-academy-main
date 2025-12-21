import express from "express";
import { getAvailableSlots } from "../services/slotService.js";

const router = express.Router();

/**
 * GET available time slots
 */
router.get("/", async (req, res) => {
  try {
    const slots = await getAvailableSlots();
    res.json({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
});

export default router;
