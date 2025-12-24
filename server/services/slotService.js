import pool from "../db.js";
import generateSlotsIfMissing  from "./slotGeneratorService.js";

export async function getAvailableSlots() {
  await generateSlotsIfMissing();

  const result = await pool.query(`
    SELECT id, slot_date, start_time, end_time, is_available
    FROM time_slots
    WHERE is_available = true
      AND slot_date >= CURRENT_DATE
    ORDER BY slot_date, start_time
  `);

  return result.rows;
}
