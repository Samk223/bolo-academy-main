import express from "express";
import pool from "../db.js";
import { getAvailableSlots } from "../services/slotService.js";
import { bookSlot } from "../services/bookingService.js";
import { sendBookingEmails } from "../services/emailService.js";


const router = express.Router();


// GET /bookings/slots - Fetch available time slots
router.get("/slots", async (req, res) => {
  try {
    const slots = await getAvailableSlots();
    res.json({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, email, phone, preferred_slot, slotId } = req.body;

    if (!name || !email || !phone || !slotId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await bookSlot({
      name,
      email,
      phone,
      preferred_slot,
      slotId
    });

    await sendBookingEmails({
      name,
      email,
      phone,
      slot: preferred_slot,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    console.error("Booking failed:", error.message);

    res.status(400).json({
      error: error.message || "Failed to create booking"
    });
  }
});
export default router;
