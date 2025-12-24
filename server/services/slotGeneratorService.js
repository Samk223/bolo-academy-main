import pool from "../db.js";

export default async function generateSlotsIfMissing() {
    const { rows } = await pool.query(`
    SELECT COUNT(*) 
    FROM time_slots 
    WHERE slot_date >= CURRENT_DATE
  `);

    if (Number(rows[0].count) > 0) return;

    console.log("Generating 1-hour slots with 1-hour gap...");

    const DAYS_AHEAD = 7;
    const START_HOUR = 12; // 12 PM
    const END_HOUR = 19;   // 7 PM (last slot starts at 6 PM)

    for (let dayOffset = 0; dayOffset < DAYS_AHEAD; dayOffset++) {
        const dateRes = await pool.query(
            `SELECT (CURRENT_DATE + $1::int)::date AS d`,
            [dayOffset]
        );


        const slotDate = dateRes.rows[0].d;
        const dayName = new Date(slotDate).getDay();

        // Skip Sunday
        if (dayName === 0) continue;

        let hour = START_HOUR;

        while (hour + 1 <= END_HOUR) {
            const start = `${String(hour).padStart(2, "0")}:00`;
            const end = `${String(hour + 1).padStart(2, "0")}:00`;

            await pool.query(
                `
        INSERT INTO time_slots (slot_date, start_time, end_time)
        VALUES ($1, $2, $3)
        `,
                [slotDate, start, end]
            );

            hour += 2; // 1 hour slot + 1 hour gap
        }
    }

    console.log("Slots generated successfully");
}
