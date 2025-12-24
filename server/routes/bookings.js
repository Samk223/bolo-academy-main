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

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone); // Indian mobile numbers

const isValidName = (name) =>
  typeof name === "string" && name.trim().length >= 2;


router.post("/", async (req, res) => {
  try {
    const { name, email, phone, preferred_slot, slotId } = req.body;

    if (!isValidName(name)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid name",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address",
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid 10-digit phone number",
      });
    }

    if (!slotId) {
      return res.status(400).json({
        success: false,
        error: "Please select a valid time slot",
      });
    }


    // 1️ Create booking 
    const booking = await bookSlot({
      name,
      email,
      phone,
      preferred_slot,
      slotId,
    });

    // 2️ Fetch slot details (THIS FIXES BLANK PAGE)
    const slotResult = await pool.query(
      `
      SELECT slot_date, start_time, end_time
      FROM time_slots
      WHERE id = $1
      `,
      [slotId]
    );

    const slot = slotResult.rows[0];

    // 3️ Send emails 
    try {
      await sendBookingEmails({
        name,
        email,
        phone,
        slot: {
          date: slot.slot_date,
          start: slot.start_time,
          end: slot.end_time,
        },
      });
    } catch (err) {
      console.error("Email error ignored:", err.message);
    }



    // await sendBookingEmails({
    //   name,
    //   email,
    //   phone,
    //   slot: {
    //     date: slot.slot_date,
    //     start: slot.start_time,
    //     end: slot.end_time,
    //   },
    // });


    // 4️ RESTORED RESPONSE SHAPE (TS COMPATIBLE)
    res.status(201).json({
      success: true,
      message: "Trial class booked successfully!",
      booking: {
        ...booking,
        slot_date: slot.slot_date,
        start_time: slot.start_time,
        end_time: slot.end_time,
      },
    });

  } catch (error) {
    console.error("Booking might take some time.", error.message);

    res.status(400).json({
      success: false,
      error: error.message || "Please dont worry, ur trial was booked.",
    });
  }
});

export default router;
