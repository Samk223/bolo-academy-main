import pool from "../db.js";

/**
 * Atomically books a slot:
 * - checks availability
 * - creates booking
 * - marks slot unavailable
 */
export async function bookSlot({
  name,
  email,
  phone,
  preferred_slot,
  slotId
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 0️ Prevent multiple bookings within 24 hours
    const recentBooking = await client.query(
      `
    SELECT 1 FROM bookings
    WHERE email = $1
    AND created_at >= NOW() - INTERVAL '24 hours'
     `,
      [email]
    );

    if (recentBooking.rows.length > 0) {
      throw new Error("You can book only one trial within 24 hours");
    }


    // 1️ Check slot availability (LOCK row)
    const slotCheck = await client.query(
      `SELECT is_available FROM time_slots WHERE id = $1 FOR UPDATE`,
      [slotId]
    );

    if (slotCheck.rows.length === 0 || !slotCheck.rows[0].is_available) {
      throw new Error("Slot is no longer available");
    }

    // 2️ Insert booking
    const bookingResult = await client.query(
      `
      INSERT INTO bookings (name, email, phone, preferred_slot)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, email, phone, preferred_slot]
    );

    // 3️ Mark slot unavailable
    await client.query(
      `UPDATE time_slots SET is_available = false WHERE id = $1`,
      [slotId]
    );

    await client.query("COMMIT");

    return bookingResult.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

}


