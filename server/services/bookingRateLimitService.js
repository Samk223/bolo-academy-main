import pool from "../db.js";

/**
 * Checks if the email has already made a booking
 * within the last 24 hours.
 * Returns true if booking is allowed.
 */
export async function canBookTrial(email) {
  const query = `
    SELECT id
    FROM bookings
    WHERE email = $1
      AND created_at > NOW() - INTERVAL '24 hours'
    LIMIT 1
  `;

  const result = await pool.query(query, [email]);

  return result.rows.length === 0;
}
